import {
  getTokenConfig,
  parseDurationToMs,
  validateTokenConfig,
} from "../config/token.config.js";

/**
 * Builds reusable cookie options for public-auth cookies.
 *
 * @param {Object} [overrides]
 * @param {Object} [config]
 * @returns {Object}
 */
export const buildCookieOptions = (
  overrides = {},
  config = getTokenConfig()
) => {
  const validConfig = validateTokenConfig(config);

  return {
    httpOnly: validConfig.cookie.httpOnly,
    secure: validConfig.cookie.secure,
    sameSite: validConfig.cookie.sameSite,
    domain: validConfig.cookie.domain,
    path: validConfig.cookie.path,
    ...overrides,
  };
};

/**
 * Builds cookie options for the access token cookie.
 *
 * @param {Object} [overrides]
 * @param {Object} [config]
 * @returns {Object}
 */
export const buildAccessTokenCookieOptions = (
  overrides = {},
  config = getTokenConfig()
) => {
  const validConfig = validateTokenConfig(config);

  return buildCookieOptions(
    {
      maxAge: parseDurationToMs(validConfig.accessTokenExpiresIn),
      ...overrides,
    },
    validConfig
  );
};

/**
 * Builds cookie options for the refresh token cookie.
 *
 * @param {Object} [overrides]
 * @param {Object} [config]
 * @returns {Object}
 */
export const buildRefreshTokenCookieOptions = (
  overrides = {},
  config = getTokenConfig()
) => {
  const validConfig = validateTokenConfig(config);

  return buildCookieOptions(
    {
      maxAge: parseDurationToMs(validConfig.refreshTokenExpiresIn),
      ...overrides,
    },
    validConfig
  );
};

/**
 * Builds cookie options that expire a public-auth cookie.
 *
 * @param {Object} [overrides]
 * @param {Object} [config]
 * @returns {Object}
 */
export const buildClearCookieOptions = (
  overrides = {},
  config = getTokenConfig()
) => buildCookieOptions({ maxAge: 0, ...overrides }, config);
