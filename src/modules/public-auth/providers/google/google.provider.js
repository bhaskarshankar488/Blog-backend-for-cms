import { OAuth2Client } from "google-auth-library";

import {
  getGoogleConfig,
  validateGoogleConfig,
} from "./google.config.js";
import {
  mapGooglePayloadToProviderProfile,
} from "./google.mapper.js";

/**
 * Google authentication provider.
 * Verifies Google ID tokens and returns normalized provider profiles.
 */
export class GoogleAuthProvider {
  /**
   * @param {Object} [options]
   * @param {Object} [options.config]
   * @param {OAuth2Client} [options.client]
   */
  constructor(options = {}) {
    this.config = options.config || getGoogleConfig();
    this.client = options.client || new OAuth2Client(this.config.clientId);
  }

  /**
   * Verifies a Google ID token and returns a normalized ProviderProfile.
   *
   * @param {string} idToken
   * @returns {Promise<Object>}
   */
  async verifyIdToken(idToken) {
    if (!idToken || typeof idToken !== "string") {
      throw new Error("Google ID token is required");
    }

    const config = validateGoogleConfig(this.config);

    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: config.clientId,
    });

    const payload = ticket.getPayload();

    this.validatePayload(payload, config);

    return mapGooglePayloadToProviderProfile(payload);
  }

  /**
   * Validates required Google ID token payload claims.
   *
   * @param {Object} payload
   * @param {Object} [config]
   * @returns {true}
   */
  validatePayload(payload, config = validateGoogleConfig(this.config)) {
    if (!payload) {
      throw new Error("Google token payload is empty");
    }

    if (!payload.sub) {
      throw new Error("Google token subject is missing");
    }

    if (payload.aud !== config.clientId) {
      throw new Error("Google token audience is invalid");
    }

    if (!config.issuers.includes(payload.iss)) {
      throw new Error("Google token issuer is invalid");
    }

    if (payload.email_verified !== true) {
      throw new Error("Google email is not verified");
    }

    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      throw new Error("Google token has expired");
    }

    return true;
  }
}

export const googleAuthProvider = new GoogleAuthProvider();

export default googleAuthProvider;
