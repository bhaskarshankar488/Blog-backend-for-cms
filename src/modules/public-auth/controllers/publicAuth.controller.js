import { publicAuthService } from "../services/publicAuth.service.js";
import {
  successResponse,
  errorResponse,
} from "../../../utils/responseHandler.js";

import { sendAuthResponse } from "../utils/authResponse.helper.js";
import { clearAuthCookies } from "../utils/cookie.helper.js";

/**
 * Ensures the request contains a valid public authentication context.
 *
 * This middleware expects publicAuth.middleware.js
 * to populate req.publicAuth.
 */
const requirePublicContext = (req) => {
  if (!req.publicAuth) {
    const error = new Error("Authentication required");
    error.status = 401;
    throw error;
  }

  const { user, session, token } = req.publicAuth;

  if (!user || !session || !token) {
    const error = new Error("Invalid authentication context");
    error.status = 401;
    throw error;
  }

  return {
    user,
    session,
    token,
    userId: String(user._id),
    sessionId: String(session._id),
    role: token.role,
  };
};

/**
 * POST /google
 */
export const authenticateWithGoogle = async (req, res) => {
  try {
    const result =
      await publicAuthService.authenticateWithGoogle(
        req.body.credential,
        {
          ipAddress: req.ip,
          userAgent: req.get("user-agent"),
        }
      );

    return sendAuthResponse(
      req,
      res,
      result,
      "Google authentication successful"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};

/**
 * POST /refresh
 */
export const refreshSession = async (req, res) => {
  try {
    const refreshToken = req.cookies.public_refresh_token;

    const result = await publicAuthService.refreshSession(
      refreshToken,
      {
        ipAddress: req.ip,
        userAgent: req.get("user-agent"),
      }
    );

    return sendAuthResponse(
      req,
      res,
      result,
      "Session refreshed successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};

/**
 * POST /logout
 */
export const logoutCurrentDevice = async (req, res) => {
  try {
    const { sessionId } = requirePublicContext(req);

    const result =
      await publicAuthService.logoutCurrentDevice(
        sessionId
      );
      clearAuthCookies(res);

    return successResponse(
      res,
      "Logged out successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};

/**
 * POST /logout-all
 */
export const logoutAllDevices = async (req, res) => {
  try {
    const { userId } = requirePublicContext(req);

    const result =
      await publicAuthService.logoutAllDevices(
        userId
      );
      clearAuthCookies(res);

    return successResponse(
      res,
      "Logged out from all devices successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};

/**
 * GET /profile
 */
export const getProfile = async (req, res) => {
  try {
    const { userId } = requirePublicContext(req);

    const result =
      await publicAuthService.getProfile(userId);

    return successResponse(
      res,
      "Profile fetched successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};