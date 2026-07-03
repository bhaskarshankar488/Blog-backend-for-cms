const GOOGLE_PROVIDER = "google";

/**
 * Maps a verified Google ID token payload to a normalized ProviderProfile.
 *
 * @param {Object} payload
 * @returns {Object}
 */
export const mapGooglePayloadToProviderProfile = (payload) => ({
  provider: GOOGLE_PROVIDER,
  providerUserId: payload.sub,
  email: payload.email || null,
  emailVerified: payload.email_verified === true,
  displayName: payload.name || "",
  firstName: payload.given_name || "",
  lastName: payload.family_name || "",
  avatarUrl: payload.picture || "",
  locale: payload.locale || "",
  metadata: {
    issuer: payload.iss,
    audience: payload.aud,
    hostedDomain: payload.hd || "",
  },
});
