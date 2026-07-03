import { DeviceSession } from "../models/deviceSession.model.js";

/**
 * Repository for device sessions and refresh token persistence.
 * This layer stores token hashes only and does not sign or verify tokens.
 */
export class DeviceSessionRepository {
  /**
   * @param {import("mongoose").Model} deviceSessionModel
   */
  constructor(deviceSessionModel = DeviceSession) {
    this.deviceSessionModel = deviceSessionModel;
  }

  /**
   * Creates a device session.
   *
   * @param {Object} sessionData
   * @returns {Promise<Object>}
   */
  async createSession(sessionData) {
    try {
      return await this.deviceSessionModel.create(sessionData);
    } catch (error) {
      throw this.#formatError(error, "Failed to create device session");
    }
  }

  /**
   * Finds a session by refresh token hash.
   *
   * @param {string} refreshTokenHash
   * @param {Object} [options]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Object|null>}
   */
  async findByRefreshTokenHash(refreshTokenHash, options = {}) {
    const { lean = false } = options;
    const operation = this.deviceSessionModel.findOne({
      refreshTokenHash,
    });

    return lean ? operation.lean() : operation;
  }

  /**
   * Finds an active session by id.
   *
   * @param {string} deviceSessionId
   * @param {Object} [options]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Object|null>}
   */
  async findActiveSession(deviceSessionId, options = {}) {
    const { lean = false } = options;
    const operation = this.deviceSessionModel.findOne({
      _id: deviceSessionId,
      status: "active",
      revokedAt: null,
      expiresAt: { $gt: new Date() },
    });

    return lean ? operation.lean() : operation;
  }

  /**
   * Finds sessions for a public user.
   *
   * @param {string} publicUserId
   * @param {Object} [options]
   * @param {boolean} [options.activeOnly=false]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Array>}
   */
  async findUserSessions(publicUserId, options = {}) {
    const { activeOnly = false, lean = false } = options;
    const query = { publicUserId };

    if (activeOnly) {
      query.status = "active";
      query.revokedAt = null;
      query.expiresAt = { $gt: new Date() };
    }

    const operation = this.deviceSessionModel
      .find(query)
      .sort({ lastUsedAt: -1, createdAt: -1 });

    return lean ? operation.lean() : operation;
  }

  /**
   * Revokes one session.
   *
   * @param {string} deviceSessionId
   * @param {string} [revokedReason]
   * @param {Date} [revokedAt]
   * @returns {Promise<Object|null>}
   */
  async revokeSession(
    deviceSessionId,
    revokedReason = "",
    revokedAt = new Date()
  ) {
    return this.deviceSessionModel.findByIdAndUpdate(
      deviceSessionId,
      {
        status: "revoked",
        revokedAt,
        revokedReason,
      },
      {
        new: true,
        runValidators: true,
      }
    );
  }

  /**
   * Revokes all sessions for a public user.
   *
   * @param {string} publicUserId
   * @param {string} [revokedReason]
   * @param {Date} [revokedAt]
   * @returns {Promise<Object>}
   */
  async revokeAllSessions(
    publicUserId,
    revokedReason = "",
    revokedAt = new Date()
  ) {
    return this.deviceSessionModel.updateMany(
      {
        publicUserId,
        status: "active",
      },
      {
        status: "revoked",
        revokedAt,
        revokedReason,
      },
      {
        runValidators: true,
      }
    );
  }

  /**
   * Creates a replacement session and marks the current session as replaced.
   *
   * @param {string} currentSessionId
   * @param {Object} replacementSessionData
   * @param {string} [revokedReason]
   * @returns {Promise<Object>}
   */
  async rotateSession(
    currentSessionId,
    replacementSessionData,
    revokedReason = "rotated"
  ) {
    const replacementSession = await this.createSession(
      replacementSessionData
    );

    await this.deviceSessionModel.findByIdAndUpdate(
      currentSessionId,
      {
        status: "revoked",
        revokedAt: new Date(),
        revokedReason,
        replacedBySessionId: replacementSession._id,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return replacementSession;
  }

  /**
   * Deletes expired sessions.
   *
   * @param {Date} [referenceDate]
   * @returns {Promise<Object>}
   */
  async deleteExpiredSessions(referenceDate = new Date()) {
    return this.deviceSessionModel.deleteMany({
      expiresAt: { $lte: referenceDate },
    });
  }

  #formatError(error, fallbackMessage) {
    if (error?.code === 11000) {
      const duplicateError = new Error("Device session already exists");
      duplicateError.status = 409;
      duplicateError.cause = error;
      return duplicateError;
    }

    error.message = error.message || fallbackMessage;
    return error;
  }
}

export const deviceSessionRepository = new DeviceSessionRepository();
