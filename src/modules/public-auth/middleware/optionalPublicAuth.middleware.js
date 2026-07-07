import { tokenService } from "../services/token.service.js";
import { publicUserRepository } from "../repositories/publicUser.repository.js";
import { deviceSessionRepository } from "../repositories/deviceSession.repository.js";
import { getTokenConfig } from "../config/token.config.js";
import { errorResponse } from "../../../utils/responseHandler.js";

const tokenConfig = getTokenConfig();

/**
 * Optional Public Authentication Middleware
 *
 * Allows both authenticated and anonymous users.
 *
 * If no access token exists:
 *    -> continue()
 *
 * If an access token exists:
 *    -> authenticate the user
 *    -> attach req.publicAuth
 *
 * Never requires authentication.
 */
export const optionalPublicAuthMiddleware = async (
  req,
  res,
  next
) => {
  try {
    let accessToken = null;

    // Authorization Header
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      accessToken = authHeader.substring(7).trim();
    }

    // Cookie fallback
    if (!accessToken && req.cookies) {
      accessToken =
        req.cookies[tokenConfig.cookie.accessTokenName] || null;
    }

    // Anonymous request
    if (!accessToken) {
      req.publicAuth = null;
      return next();
    }

    // Verify token
    const decoded = tokenService.verifyAccessToken(accessToken);

    // Validate session
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

    // Load user
    const publicUser = await publicUserRepository.findById(
      decoded.userId
    );

    if (!publicUser) {
      return errorResponse(
        res,
        "Public user not found",
        401
      );
    }

    // Validate ownership
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

    req.publicAuth = {
      user: publicUser,
      userId: String(publicUser._id),
      session,
      token: decoded,
    };

    return next();
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Invalid authentication token",
      error.status || 401
    );
  }
};

export default optionalPublicAuthMiddleware;