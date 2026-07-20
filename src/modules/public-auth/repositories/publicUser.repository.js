import { PublicUser } from "../models/publicUser.model.js";

/**
 * Repository for public user persistence.
 * All methods communicate only with the PublicUser Mongoose model.
 */
export class PublicUserRepository {
  /**
   * @param {import("mongoose").Model} publicUserModel
   */
  constructor(publicUserModel = PublicUser) {
    this.publicUserModel = publicUserModel;
  }

  /**
   * Creates a public user.
   *
   * @param {Object} userData
   * @returns {Promise<Object>}
   */
  async create(userData) {
    try {
      return await this.publicUserModel.create(userData);
    } catch (error) {
      throw this.#formatError(error, "Failed to create public user");
    }
  }

  /**
   * Finds a public user by id.
   *
   * @param {string} publicUserId
   * @param {Object} [options]
   * @param {boolean} [options.includeDeleted=false]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Object|null>}
   */
  async findById(publicUserId, options = {}) {
    const { includeDeleted = false, lean = false } = options;
    const query = { _id: publicUserId };

    if (!includeDeleted) {
      query.deletedAt = null;
    }

    const operation = this.publicUserModel.findOne(query);

    return lean ? operation.lean() : operation;
  }

  /**
   * Finds a public user by primary email.
   *
   * @param {string} primaryEmail
   * @param {Object} [options]
   * @param {boolean} [options.includeDeleted=false]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Object|null>}
   */
  async findByPrimaryEmail(primaryEmail, options = {}) {
    const { includeDeleted = false, lean = false } = options;
    const query = {
      primaryEmail: this.#normalizeEmail(primaryEmail),
    };

    if (!includeDeleted) {
      query.deletedAt = null;
    }

    const operation = this.publicUserModel.findOne(query);

    return lean ? operation.lean() : operation;
  }

  /**
   * Updates a public user by id.
   *
   * @param {string} publicUserId
   * @param {Object} updateData
   * @param {Object} [options]
   * @param {boolean} [options.lean=false]
   * @returns {Promise<Object|null>}
   */
  async updateById(publicUserId, updateData, options = {}) {
    const { lean = false } = options;
    const operation = this.publicUserModel.findByIdAndUpdate(
      publicUserId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    return lean ? operation.lean() : operation;
  }

  /**
   * Updates the public user's last login timestamp.
   *
   * @param {string} publicUserId
   * @param {Date} [loginDate]
   * @returns {Promise<Object|null>}
   */
  async updateLastLogin(publicUserId, loginDate = new Date()) {
    return this.updateById(publicUserId, {
      lastLoginAt: loginDate,
    });
  }

  /**
   * Updates the public user's status.
   *
   * @param {string} publicUserId
   * @param {string} status
   * @returns {Promise<Object|null>}
   */
  async updateStatus(publicUserId, status) {
    return this.updateById(publicUserId, { status });
  }

  /**
   * Soft deletes a public user.
   *
   * @param {string} publicUserId
   * @param {Date} [deletedAt]
   * @returns {Promise<Object|null>}
   */
  async softDelete(publicUserId, deletedAt = new Date()) {
    return this.updateById(publicUserId, {
      status: "deleted",
      deletedAt,
    });
  }

  /**
   * Restores a soft-deleted public user.
   *
   * @param {string} publicUserId
   * @returns {Promise<Object|null>}
   */
  async restore(publicUserId) {
    return this.updateById(publicUserId, {
      status: "active",
      deletedAt: null,
    });
  }

  /**
   * Checks whether a non-deleted public user exists by email.
   *
   * @param {string} primaryEmail
   * @returns {Promise<boolean>}
   */
  async existsByEmail(primaryEmail) {
    const existingUser = await this.publicUserModel.exists({
      primaryEmail: this.#normalizeEmail(primaryEmail),
      deletedAt: null,
    });

    return Boolean(existingUser);
  }

  #normalizeEmail(email) {
    return typeof email === "string" ? email.toLowerCase().trim() : email;
  }

  #formatError(error, fallbackMessage) {
    if (error?.code === 11000) {
      const duplicateError = new Error("Public user already exists");
      duplicateError.status = 409;
      duplicateError.cause = error;
      return duplicateError;
    }

    error.message = error.message || fallbackMessage;
    return error;
  }
}

export const publicUserRepository = new PublicUserRepository();
