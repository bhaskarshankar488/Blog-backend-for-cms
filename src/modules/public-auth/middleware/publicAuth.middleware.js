import { tokenService } from "../services/token.service.js";
import { publicUserRepository } from "../repositories/publicUser.repository.js";
import { deviceSessionRepository } from "../repositories/deviceSession.repository.js";
import { getTokenConfig } from "../config/token.config.js";
import { errorResponse } from "../../../utils/responseHandler.js";

const tokenConfig = getTokenConfig();

/**
 * Public Authentication Middleware
 *
 * Responsibilities:
 * - Read Access Token
 * - Verify Access Token
 * - Validate Device Session
 * - Load Public User
 * - Attach Authentication Context
 *
 * This middleware does NOT:
 * - Check account status
 * - Perform authorization
 * - Generate tokens
 * - Handle Google authentication
 *
 * Account status validation is handled separately by:
 * accountStatus.middleware.js
 */
export const publicAuthMiddleware = async (req, res, next) => {
  try {
    let accessToken = null;

    /**
     * Authorization Header
     * Authorization: Bearer <token>
     */
    const authHeader = req.headers.authorization;

    if (
      authHeader &&
      authHeader.startsWith("Bearer ")
    ) {
      accessToken = authHeader.substring(7).trim();
    }

    /**
     * Cookie Fallback
     */
    if (!accessToken && req.cookies) {
      accessToken =
        req.cookies[tokenConfig.cookie.accessTokenName] ||
        null;
    }

    if (!accessToken) {
      return errorResponse(
        res,
        "Access token is required",
        401
      );
    }

    /**
     * Verify JWT
     */
    const decoded =
      tokenService.verifyAccessToken(accessToken);

    /**
     * Validate Active Device Session
     */
    const session =
      await deviceSessionRepository.findActiveSession(
        decoded.sessionId
      );

    if (!session) {
      return errorResponse(
        res,
        "Invalid or expired session",
        401
      );
    }

    /**
     * Load Public User
     */
    const publicUser =
      await publicUserRepository.findById(
        decoded.userId
      );

    if (!publicUser) {
      return errorResponse(
        res,
        "Public user not found",
        401
      );
    }

    /**
     * Ensure session belongs to authenticated user
     */
    if (
      String(session.publicUserId) !==
      String(publicUser._id)
    ) {
      return errorResponse(
        res,
        "Invalid session",
        401
      );
    }

    /**
     * Optional:
     * Update last activity.
     *
     * Uncomment after adding repository method.
     */
    // await deviceSessionRepository.touchSession(
    //   session._id
    // );

    /**
     * Authentication Context
     */
    req.publicAuth = {
      user: publicUser,
      session,
      token: decoded,

      userId: String(publicUser._id),
      sessionId: String(session._id),
      role: decoded.role,
    };

    return next();
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Unauthorized",
      error.status || 401
    );
  }
};

export default publicAuthMiddleware;