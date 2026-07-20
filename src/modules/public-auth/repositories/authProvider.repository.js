import { AuthProvider } from "../models/authProvider.model.js";

/**
 * Repository for external authentication provider identities.
 * This layer does not contain provider-specific authentication behavior.
 */
export class AuthProviderRepository {
  /**
   * @param {import("mongoose").Model} authProviderModel
   */
  constructor(authProviderModel = AuthProvider) {
    this.authProviderModel = authProviderModel;
  }

  /**
   * Creates an authentication provider identity.
   *
   * @param {Object} providerData
   * @returns {Promise<Object>}
   */
  async create(providerData) {
    try {
      return await this.authProviderModel.create(providerData);
    } catch (error) {
      throw this.#formatError(error, "Failed to create auth provider");
    }
  }

  /**
   * Finds identities by provider name.
   *
   * @param {string} provider
   * @param {Object} [options]
   * @param {boolean} [options.includeDisconnected=false]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Array>}
   */
  async findByProvider(provider, options = {}) {
    const { includeDisconnected = false, lean = false } = options;
    const query = { provider };

    if (!includeDisconnected) {
      query.disconnectedAt = null;
    }

    const operation = this.authProviderModel.find(query);

    return lean ? operation.lean() : operation;
  }

  /**
   * Finds one identity by provider and external account id.
   *
   * @param {string} provider
   * @param {string} providerAccountId
   * @param {Object} [options]
   * @param {boolean} [options.includeDisconnected=false]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Object|null>}
   */
  async findByProviderAccountId(
    provider,
    providerAccountId,
    options = {}
  ) {
    const { includeDisconnected = false, lean = false } = options;
    const query = {
      provider,
      providerAccountId,
    };

    if (!includeDisconnected) {
      query.disconnectedAt = null;
    }

    const operation = this.authProviderModel.findOne(query);

    return lean ? operation.lean() : operation;
  }

  /**
   * Finds provider identities linked to a public user.
   *
   * @param {string} publicUserId
   * @param {Object} [options]
   * @param {boolean} [options.includeDisconnected=false]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Array>}
   */
  async findByPublicUser(publicUserId, options = {}) {
    const { includeDisconnected = false, lean = false } = options;
    const query = { publicUserId };

    if (!includeDisconnected) {
      query.disconnectedAt = null;
    }

    const operation = this.authProviderModel
      .find(query)
      .sort({ connectedAt: -1 });

    return lean ? operation.lean() : operation;
  }

  /**
   * Links a provider identity to a public user.
   *
   * @param {Object} providerData
   * @returns {Promise<Object>}
   */
  async linkProvider(providerData) {
    return this.create({
      ...providerData,
      disconnectedAt: null,
    });
  }

  /**
   * Marks a provider identity as disconnected.
   *
   * @param {string} authProviderId
   * @param {Date} [disconnectedAt]
   * @returns {Promise<Object|null>}
   */
  async unlinkProvider(authProviderId, disconnectedAt = new Date()) {
    return this.authProviderModel.findByIdAndUpdate(
      authProviderId,
      { disconnectedAt },
      {
       returnDocument: "after",
        runValidators: true,
      }
    );
  }

  /**
   * Updates the last used timestamp for a provider identity.
   *
   * @param {string} authProviderId
   * @param {Date} [lastUsedAt]
   * @returns {Promise<Object|null>}
   */
  async updateLastUsed(authProviderId, lastUsedAt = new Date()) {
    return this.authProviderModel.findByIdAndUpdate(
      authProviderId,
      { lastUsedAt },
      {
        returnDocument: "after",
        runValidators: true,
      }
    );
  }

  /**
   * Checks whether an active provider identity exists.
   *
   * @param {string} provider
   * @param {string} providerAccountId
   * @returns {Promise<boolean>}
   */
  async existsProvider(provider, providerAccountId) {
    const existingProvider = await this.authProviderModel.exists({
      provider,
      providerAccountId,
      disconnectedAt: null,
    });

    return Boolean(existingProvider);
  }

  #formatError(error, fallbackMessage) {
    if (error?.code === 11000) {
      const duplicateError = new Error("Auth provider already exists");
      duplicateError.status = 409;
      duplicateError.cause = error;
      return duplicateError;
    }

    error.message = error.message || fallbackMessage;
    return error;
  }
}

export const authProviderRepository = new AuthProviderRepository();
