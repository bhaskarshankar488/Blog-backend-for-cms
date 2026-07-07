import dotenv from "dotenv";

dotenv.config();

const DEFAULT_COOKIE_PATH = "/";

/**
 * Parses duration strings such as 15m, 7d, 3600s, or 1000ms.
 *
 * @param {string|number} duration
 * @returns {number}
 */
export const parseDurationToMs = (duration) => {
  if (typeof duration === "number") {
    return duration;
  }

  const match = String(duration || "").trim().match(/^(\d+)(ms|s|m|h|d)$/);

  if (!match) {
    throw new Error(`Invalid duration format: ${duration}`);
  }

  const value = Number(match[1]);
  const unit = match[2];
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 1000 * 60,
    h: 1000 * 60 * 60,
    d: 1000 * 60 * 60 * 24,
  };

  return value * multipliers[unit];
};

/**
 * Loads token and cookie configuration from environment variables.
 *
 * @returns {Object}
 */
export const getTokenConfig = () => {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    accessTokenSecret: process.env.PUBLIC_AUTH_ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.PUBLIC_AUTH_REFRESH_TOKEN_SECRET,
    accessTokenExpiresIn:
      process.env.PUBLIC_AUTH_ACCESS_TOKEN_EXPIRES_IN,
    refreshTokenExpiresIn:
      process.env.PUBLIC_AUTH_REFRESH_TOKEN_EXPIRES_IN,
    issuer: process.env.PUBLIC_AUTH_JWT_ISSUER,
    audience: process.env.PUBLIC_AUTH_JWT_AUDIENCE,
    cookie: {
      accessTokenName:
        process.env.PUBLIC_AUTH_ACCESS_COOKIE_NAME ||
        "public_access_token",
      refreshTokenName:
        process.env.PUBLIC_AUTH_REFRESH_COOKIE_NAME ||
        "public_refresh_token",
      sameSite:
        process.env.PUBLIC_AUTH_COOKIE_SAME_SITE ||
        (isProduction ? "none" : "lax"),
      secure:
        process.env.PUBLIC_AUTH_COOKIE_SECURE === undefined
          ? isProduction
          : process.env.PUBLIC_AUTH_COOKIE_SECURE === "true",
      httpOnly: true,
      domain: process.env.PUBLIC_AUTH_COOKIE_DOMAIN || undefined,
      path: process.env.PUBLIC_AUTH_COOKIE_PATH || DEFAULT_COOKIE_PATH,
    },
  };
};

/**
 * Validates required token configuration.
 *
 * @param {Object} config
 * @returns {Object}
 */
export const validateTokenConfig = (config = getTokenConfig()) => {
  if (!config.accessTokenSecret) {
    throw new Error("PUBLIC_AUTH_ACCESS_TOKEN_SECRET is required");
  }

  if (!config.refreshTokenSecret) {
    throw new Error("PUBLIC_AUTH_REFRESH_TOKEN_SECRET is required");
  }

  if (!config.accessTokenExpiresIn) {
    throw new Error("PUBLIC_AUTH_ACCESS_TOKEN_EXPIRES_IN is required");
  }

  if (!config.refreshTokenExpiresIn) {
    throw new Error("PUBLIC_AUTH_REFRESH_TOKEN_EXPIRES_IN is required");
  }

  parseDurationToMs(config.accessTokenExpiresIn);
  parseDurationToMs(config.refreshTokenExpiresIn);

  return config;
};

export const tokenConfig = getTokenConfig();
