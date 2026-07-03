import dotenv from "dotenv";

dotenv.config();

const GOOGLE_ISSUERS = [
  "accounts.google.com",
  "https://accounts.google.com",
];

/**
 * Loads Google provider configuration from environment variables.
 *
 * @returns {Object}
 */
export const getGoogleConfig = () => ({
  clientId: process.env.PUBLIC_GOOGLE_CLIENT_ID,
  clientSecret: process.env.PUBLIC_GOOGLE_CLIENT_SECRET,
  issuers: GOOGLE_ISSUERS,
});

/**
 * Validates that required Google provider configuration exists.
 *
 * @param {Object} config
 * @returns {Object}
 */
export const validateGoogleConfig = (config = getGoogleConfig()) => {
  if (!config.clientId) {
    throw new Error("PUBLIC_GOOGLE_CLIENT_ID is required");
  }

  if (!config.clientSecret) {
    throw new Error("PUBLIC_GOOGLE_CLIENT_SECRET is required");
  }

  return config;
};

export const googleConfig = getGoogleConfig();
