import { successResponse } from "../../../utils/responseHandler.js";
import { setAuthCookies } from "./cookie.helper.js";

export const sendAuthResponse = (
  req,
  res,
  result,
  message
) => {

  // Future mobile support
  const isMobile =
    req.headers["x-client-type"] === "mobile";

  if (isMobile) {
    return successResponse(
      res,
      message,
      result,
      200
    );
  }

  // Browser
  setAuthCookies(res, result.tokens);

  delete result.tokens;

  return successResponse(
    res,
    message,
    result,
    200
  );
};