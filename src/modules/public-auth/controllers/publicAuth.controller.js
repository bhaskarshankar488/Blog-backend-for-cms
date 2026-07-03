import {
  publicAuthService,
} from "../services/publicAuth.service.js";
import {
  successResponse,
  errorResponse,
} from "../../../utils/responseHandler.js";

const getPublicUserId = (req) =>
  req.publicUser?.id ||
  req.publicUser?._id ||
  req.publicAuth?.userId;

const getPublicSessionId = (req) =>
  req.publicSession?.id ||
  req.publicSession?._id ||
  req.publicAuth?.sessionId;

const requirePublicContext = (req) => {
  const userId = getPublicUserId(req);
  const sessionId = getPublicSessionId(req);

  if (!userId) {
    const error = new Error("Public authentication required");
    error.status = 401;
    throw error;
  }

  return {
    userId,
    sessionId,
  };
};

export const authenticateWithGoogle = async (req, res) => {
  try {
    const result = await publicAuthService.authenticateWithGoogle(
      req.body.credential
    );

    return successResponse(
      res,
      "Google authentication successful",
      result,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const refreshSession = async (req, res) => {
  try {
    const result = await publicAuthService.refreshSession(
      req.body.refreshToken
    );

    return successResponse(
      res,
      "Session refreshed successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const logoutCurrentDevice = async (req, res) => {
  try {
    const { sessionId } = requirePublicContext(req);

    if (!sessionId) {
      return errorResponse(res, "Public session required", 401);
    }

    const result = await publicAuthService.logoutCurrentDevice(
      sessionId
    );

    return successResponse(
      res,
      "Logged out successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const logoutAllDevices = async (req, res) => {
  try {
    const { userId } = requirePublicContext(req);

    const result = await publicAuthService.logoutAllDevices(userId);

    return successResponse(
      res,
      "Logged out from all devices successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = requirePublicContext(req);

    const result = await publicAuthService.getProfile(userId);

    return successResponse(
      res,
      "Profile fetched successfully",
      result,
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};
