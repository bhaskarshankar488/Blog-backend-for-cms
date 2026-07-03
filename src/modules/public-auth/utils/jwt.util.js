import jwt from "jsonwebtoken";

import {
  getTokenConfig,
  validateTokenConfig,
} from "../config/token.config.js";

const TOKEN_TYPES = {
  access: "access",
  refresh: "refresh",
};

const buildSignOptions = (expiresIn, config) => ({
  expiresIn,
  issuer: config.issuer,
  audience: config.audience,
});

const buildVerifyOptions = (config) => ({
  issuer: config.issuer,
  audience: config.audience,
});

/**
 * Signs a public-auth access token.
 *
 * @param {Object} payload
 * @param {Object} [config]
 * @returns {string}
 */
export const signAccessToken = (payload, config = getTokenConfig()) => {
  const validConfig = validateTokenConfig(config);

  return jwt.sign(
    {
      ...payload,
      type: TOKEN_TYPES.access,
    },
    validConfig.accessTokenSecret,
    buildSignOptions(validConfig.accessTokenExpiresIn, validConfig)
  );
};

/**
 * Signs a public-auth refresh token.
 *
 * @param {Object} payload
 * @param {Object} [config]
 * @returns {string}
 */
export const signRefreshToken = (payload, config = getTokenConfig()) => {
  const validConfig = validateTokenConfig(config);

  return jwt.sign(
    {
      ...payload,
      type: TOKEN_TYPES.refresh,
    },
    validConfig.refreshTokenSecret,
    buildSignOptions(validConfig.refreshTokenExpiresIn, validConfig)
  );
};

/**
 * Verifies a public-auth access token.
 *
 * @param {string} token
 * @param {Object} [config]
 * @returns {Object}
 */
export const verifyAccessToken = (token, config = getTokenConfig()) => {
  const validConfig = validateTokenConfig(config);
  const payload = jwt.verify(
    token,
    validConfig.accessTokenSecret,
    buildVerifyOptions(validConfig)
  );

  if (payload.type !== TOKEN_TYPES.access) {
    throw new Error("Invalid access token type");
  }

  return payload;
};

/**
 * Verifies a public-auth refresh token.
 *
 * @param {string} token
 * @param {Object} [config]
 * @returns {Object}
 */
export const verifyRefreshToken = (token, config = getTokenConfig()) => {
  const validConfig = validateTokenConfig(config);
  const payload = jwt.verify(
    token,
    validConfig.refreshTokenSecret,
    buildVerifyOptions(validConfig)
  );

  if (payload.type !== TOKEN_TYPES.refresh) {
    throw new Error("Invalid refresh token type");
  }

  return payload;
};

/**
 * Decodes a token without validating its signature.
 *
 * @param {string} token
 * @returns {Object|null}
 */
export const decodeToken = (token) => jwt.decode(token);
