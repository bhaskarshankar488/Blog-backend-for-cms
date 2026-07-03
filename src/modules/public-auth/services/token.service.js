import crypto from "crypto";
import mongoose from "mongoose";

import {
  deviceSessionRepository,
} from "../repositories/deviceSession.repository.js";
import {
  getTokenConfig,
  parseDurationToMs,
  validateTokenConfig,
} from "../config/token.config.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken as verifyAccessJwt,
  verifyRefreshToken as verifyRefreshJwt,
} from "../utils/jwt.util.js";

/**
 * Token infrastructure service for public authentication.
 * This service manages token signing, token hashing, and device sessions.
 */
export class TokenService {
  /**
   * @param {Object} [options]
   * @param {Object} [options.sessionRepository]
   * @param {Object} [options.config]
   */
  constructor(options = {}) {
    this.sessionRepository =
      options.sessionRepository || deviceSessionRepository;
    this.config = options.config || getTokenConfig();
  }

  /**
   * Generates an access/refresh token pair and stores a hashed refresh token.
   *
   * @param {Object} payload
   * @param {string} payload.userId
   * @param {string} [payload.role]
   * @param {number} [payload.tokenVersion]
   * @param {Object} [sessionData]
   * @returns {Promise<Object>}
   */
  async generateTokenPair(payload, sessionData = {}) {
    const validConfig = validateTokenConfig(this.config);
    const sessionId =
      sessionData.sessionId || new mongoose.Types.ObjectId();
    const tokenVersion = payload.tokenVersion || 1;

    const accessPayload = {
      userId: payload.userId,
      role: payload.role || "public",
      sessionId: String(sessionId),
      tokenVersion,
    };

    const refreshPayload = {
      userId: payload.userId,
      sessionId: String(sessionId),
      tokenVersion,
    };

    const accessToken = signAccessToken(accessPayload, validConfig);
    const refreshToken = signRefreshToken(refreshPayload, validConfig);
    const refreshTokenHash = this.hashRefreshToken(refreshToken);

    const session = await this.sessionRepository.createSession({
      _id: sessionId,
      publicUserId: payload.userId,
      authProviderId: sessionData.authProviderId || null,
      refreshTokenHash,
      tokenFamilyId: sessionData.tokenFamilyId || crypto.randomUUID(),
      deviceId: sessionData.deviceId || "",
      deviceName: sessionData.deviceName || "",
      userAgent: sessionData.userAgent || "",
      ipAddress: sessionData.ipAddress || "",
      status: "active",
      issuedAt: new Date(),
      expiresAt: this.getRefreshTokenExpiryDate(validConfig),
    });

    return {
      accessToken,
      refreshToken,
      session,
      accessTokenPayload: accessPayload,
      refreshTokenPayload: refreshPayload,
    };
  }

  /**
   * Rotates a refresh token and revokes the previous device session.
   *
   * @param {string} refreshToken
   * @param {Object} [options]
   * @returns {Promise<Object>}
   */
  async rotateRefreshToken(refreshToken, options = {}) {
    const { payload, session } = await this.verifyRefreshToken(
      refreshToken
    );

    const nextTokenVersion =
      options.tokenVersion || payload.tokenVersion || 1;

    const tokenPair = await this.#buildTokenPairWithoutSession({
      userId: payload.userId,
      role: options.role || "public",
      tokenVersion: nextTokenVersion,
      authProviderId: options.authProviderId || session.authProviderId,
      tokenFamilyId: session.tokenFamilyId,
      deviceId: options.deviceId || session.deviceId,
      deviceName: options.deviceName || session.deviceName,
      userAgent: options.userAgent || session.userAgent,
      ipAddress: options.ipAddress || session.ipAddress,
    });

    const replacementSession =
      await this.sessionRepository.rotateSession(
        session._id,
        tokenPair.sessionData,
        "rotated"
      );

    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
      session: replacementSession,
      accessTokenPayload: tokenPair.accessTokenPayload,
      refreshTokenPayload: tokenPair.refreshTokenPayload,
    };
  }

  /**
   * Revokes one device session.
   *
   * @param {string} sessionId
   * @param {string} [reason]
   * @returns {Promise<Object|null>}
   */
  async revokeSession(sessionId, reason = "logout") {
    return this.sessionRepository.revokeSession(sessionId, reason);
  }

  /**
   * Revokes all active sessions for a public user.
   *
   * @param {string} userId
   * @param {string} [reason]
   * @returns {Promise<Object>}
   */
  async revokeAllSessions(userId, reason = "logout_all") {
    return this.sessionRepository.revokeAllSessions(userId, reason);
  }

  /**
   * Verifies a refresh token and validates its backing device session.
   *
   * @param {string} refreshToken
   * @returns {Promise<Object>}
   */
  async verifyRefreshToken(refreshToken) {
    const payload = verifyRefreshJwt(refreshToken, this.config);
    const refreshTokenHash = this.hashRefreshToken(refreshToken);
    const session =
      await this.sessionRepository.findByRefreshTokenHash(
        refreshTokenHash
      );

    if (!session) {
      throw new Error("Refresh token session not found");
    }

    if (String(session._id) !== String(payload.sessionId)) {
      throw new Error("Refresh token session mismatch");
    }

    if (String(session.publicUserId) !== String(payload.userId)) {
      throw new Error("Refresh token user mismatch");
    }

    if (session.status !== "active" || session.revokedAt) {
      throw new Error("Refresh token session is not active");
    }

    if (session.expiresAt <= new Date()) {
      throw new Error("Refresh token session has expired");
    }

    return { payload, session };
  }

  /**
   * Verifies an access token.
   *
   * @param {string} accessToken
   * @returns {Object}
   */
  verifyAccessToken(accessToken) {
    return verifyAccessJwt(accessToken, this.config);
  }

  /**
   * Hashes a refresh token for persistence.
   *
   * @param {string} refreshToken
   * @returns {string}
   */
  hashRefreshToken(refreshToken) {
    return crypto
      .createHash("sha256")
      .update(refreshToken)
      .digest("hex");
  }

  /**
   * Calculates the refresh token expiration date.
   *
   * @param {Object} [config]
   * @returns {Date}
   */
  getRefreshTokenExpiryDate(config = validateTokenConfig(this.config)) {
    return new Date(
      Date.now() + parseDurationToMs(config.refreshTokenExpiresIn)
    );
  }

  async #buildTokenPairWithoutSession(options) {
    const validConfig = validateTokenConfig(this.config);
    const sessionId = new mongoose.Types.ObjectId();

    const accessTokenPayload = {
      userId: options.userId,
      role: options.role || "public",
      sessionId: String(sessionId),
      tokenVersion: options.tokenVersion || 1,
    };

    const refreshTokenPayload = {
      userId: options.userId,
      sessionId: String(sessionId),
      tokenVersion: options.tokenVersion || 1,
    };

    const accessToken = signAccessToken(
      accessTokenPayload,
      validConfig
    );
    const refreshToken = signRefreshToken(
      refreshTokenPayload,
      validConfig
    );

    return {
      accessToken,
      refreshToken,
      accessTokenPayload,
      refreshTokenPayload,
      sessionData: {
        _id: sessionId,
        publicUserId: options.userId,
        authProviderId: options.authProviderId || null,
        refreshTokenHash: this.hashRefreshToken(refreshToken),
        tokenFamilyId: options.tokenFamilyId || crypto.randomUUID(),
        deviceId: options.deviceId || "",
        deviceName: options.deviceName || "",
        userAgent: options.userAgent || "",
        ipAddress: options.ipAddress || "",
        status: "active",
        issuedAt: new Date(),
        expiresAt: this.getRefreshTokenExpiryDate(validConfig),
      },
    };
  }
}

export const tokenService = new TokenService();
