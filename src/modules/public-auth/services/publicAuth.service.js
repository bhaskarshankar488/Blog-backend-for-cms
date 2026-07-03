import {
  publicUserRepository,
} from "../repositories/publicUser.repository.js";
import {
  authProviderRepository,
} from "../repositories/authProvider.repository.js";
import {
  googleAuthProvider,
} from "../providers/google/google.provider.js";
import { tokenService } from "./token.service.js";

/**
 * Public authentication orchestration service.
 * Contains business rules, provider linking, session creation, and DTO mapping.
 */
export class PublicAuthService {
  /**
   * @param {Object} [dependencies]
   * @param {Object} [dependencies.publicUsers]
   * @param {Object} [dependencies.authProviders]
   * @param {Object} [dependencies.googleProvider]
   * @param {Object} [dependencies.tokens]
   */
  constructor(dependencies = {}) {
    this.publicUsers = dependencies.publicUsers || publicUserRepository;
    this.authProviders =
      dependencies.authProviders || authProviderRepository;
    this.googleProvider =
      dependencies.googleProvider || googleAuthProvider;
    this.tokens = dependencies.tokens || tokenService;
  }

  /**
   * Authenticates a public user with a Google ID token.
   *
   * @param {string} idToken
   * @param {Object} [sessionData]
   * @returns {Promise<Object>}
   */
  async authenticateWithGoogle(idToken, sessionData = {}) {
    const profile = await this.googleProvider.verifyIdToken(idToken);

    if (!profile.emailVerified) {
      throw this.#createError("Google email must be verified", 401);
    }

    let authProvider =
      await this.authProviders.findByProviderAccountId(
        profile.provider,
        profile.providerUserId
      );

    let publicUser;

    if (authProvider) {
      publicUser = await this.publicUsers.findById(
        authProvider.publicUserId,
        { includeDeleted: true }
      );
    } else {
      publicUser = await this.publicUsers.findByPrimaryEmail(
        profile.email
      );

      if (publicUser) {
        authProvider = await this.#linkProvider(publicUser, profile);
      } else {
        publicUser = await this.#createPublicUser(profile);
        authProvider = await this.#linkProvider(publicUser, profile);
      }
    }

    this.#assertUserCanAuthenticate(publicUser);

    const loginDate = new Date();
    const updatedUser = await this.#recordSuccessfulLogin(
      publicUser,
      loginDate
    );
    const updatedProvider =
      await this.authProviders.updateLastUsed(
        authProvider._id,
        loginDate
      );

    const tokenPair = await this.tokens.generateTokenPair(
      {
        userId: String(updatedUser._id),
        role: "public",
        tokenVersion: updatedUser.tokenVersion || 1,
      },
      {
        ...sessionData,
        authProviderId: updatedProvider?._id || authProvider._id,
      }
    );

    return this.#toAuthSessionDto({
      user: updatedUser,
      authProvider: updatedProvider || authProvider,
      tokenPair,
    });
  }

  /**
   * Rotates a refresh token and returns a fresh auth session DTO.
   *
   * @param {string} refreshToken
   * @param {Object} [sessionData]
   * @returns {Promise<Object>}
   */
  async refreshSession(refreshToken, sessionData = {}) {
    const tokenPair = await this.tokens.rotateRefreshToken(
      refreshToken,
      sessionData
    );

    const publicUser = await this.publicUsers.findById(
      tokenPair.refreshTokenPayload.userId,
      { includeDeleted: true }
    );

    this.#assertUserCanAuthenticate(publicUser);

    return this.#toAuthSessionDto({
      user: publicUser,
      authProvider: null,
      tokenPair,
    });
  }

  /**
   * Logs out the current device by revoking one device session.
   *
   * @param {string} sessionId
   * @returns {Promise<Object>}
   */
  async logoutCurrentDevice(sessionId) {
    const session = await this.tokens.revokeSession(
      sessionId,
      "logout_current_device"
    );

    return {
      success: true,
      session: this.#toSessionDto(session),
    };
  }

  /**
   * Logs out all active devices for a public user.
   *
   * @param {string} publicUserId
   * @returns {Promise<Object>}
   */
  async logoutAllDevices(publicUserId) {
    const result = await this.tokens.revokeAllSessions(
      publicUserId,
      "logout_all_devices"
    );

    return {
      success: true,
      revokedCount: result.modifiedCount || 0,
    };
  }

  /**
   * Returns the public-safe profile DTO for a public user.
   *
   * @param {string} publicUserId
   * @returns {Promise<Object>}
   */
  async getProfile(publicUserId) {
    const publicUser = await this.publicUsers.findById(
      publicUserId,
      { includeDeleted: true }
    );

    this.#assertUserCanAuthenticate(publicUser);

    const providers =
      await this.authProviders.findByPublicUser(publicUserId);

    return {
      user: this.#toPublicUserDto(publicUser),
      providers: providers.map((provider) =>
        this.#toAuthProviderDto(provider)
      ),
    };
  }

  async #createPublicUser(profile) {
    return this.publicUsers.create({
      primaryEmail: profile.email,
      emailVerified: profile.emailVerified,
      displayName: profile.displayName,
      firstName: profile.firstName,
      lastName: profile.lastName,
      avatarUrl: profile.avatarUrl,
      status: "active",
      lastLoginAt: null,
    });
  }

  async #linkProvider(publicUser, profile) {
    return this.authProviders.linkProvider({
      publicUserId: publicUser._id,
      provider: profile.provider,
      providerAccountId: profile.providerUserId,
      providerEmail: profile.email,
      providerEmailVerified: profile.emailVerified,
      displayName: profile.displayName,
      avatarUrl: profile.avatarUrl,
      scopes: [],
      metadata: profile.metadata || {},
    });
  }

  async #recordSuccessfulLogin(publicUser, loginDate) {
    return this.publicUsers.updateById(publicUser._id, {
      $set: {
        lastLoginAt: loginDate,
      },
      $inc: {
        loginCount: 1,
      },
    });
  }

  #assertUserCanAuthenticate(publicUser) {
    if (!publicUser) {
      throw this.#createError("Public user not found", 404);
    }

    if (publicUser.deletedAt || publicUser.status === "deleted") {
      throw this.#createError("Public user is deleted", 403);
    }

    if (publicUser.status === "suspended") {
      throw this.#createError("Public user is suspended", 403);
    }

    return true;
  }

  #toAuthSessionDto({ user, authProvider, tokenPair }) {
    return {
      user: this.#toPublicUserDto(user),
      provider: authProvider
        ? this.#toAuthProviderDto(authProvider)
        : null,
      session: this.#toSessionDto(tokenPair.session),
      tokens: {
        accessToken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
        tokenType: "Bearer",
      },
    };
  }

  #toPublicUserDto(user) {
    return {
      id: String(user._id),
      primaryEmail: user.primaryEmail,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatarUrl: user.avatarUrl,
      status: user.status,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  #toAuthProviderDto(authProvider) {
    return {
      id: String(authProvider._id),
      provider: authProvider.provider,
      providerEmail: authProvider.providerEmail,
      providerEmailVerified: authProvider.providerEmailVerified,
      displayName: authProvider.displayName,
      avatarUrl: authProvider.avatarUrl,
      profileUrl: authProvider.profileUrl,
      connectedAt: authProvider.connectedAt,
      lastUsedAt: authProvider.lastUsedAt,
    };
  }

  #toSessionDto(session) {
    if (!session) {
      return null;
    }

    return {
      id: String(session._id),
      status: session.status,
      deviceId: session.deviceId,
      deviceName: session.deviceName,
      issuedAt: session.issuedAt,
      lastUsedAt: session.lastUsedAt,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    };
  }

  #createError(message, status = 500) {
    const error = new Error(message);
    error.status = status;
    return error;
  }
}

export const publicAuthService = new PublicAuthService();
