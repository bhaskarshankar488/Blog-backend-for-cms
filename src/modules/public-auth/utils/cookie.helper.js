import { tokenConfig, parseDurationToMs } from "../config/token.config.js";

export const setAuthCookies = (res, tokens) => {
  res.cookie(
    tokenConfig.cookie.accessTokenName,
    tokens.accessToken,
    {
      httpOnly: true,
      secure: tokenConfig.cookie.secure,
      sameSite: tokenConfig.cookie.sameSite,
      domain: tokenConfig.cookie.domain,
      path: tokenConfig.cookie.path,
      maxAge: parseDurationToMs(
        tokenConfig.accessTokenExpiresIn
      ),
    }
  );

  res.cookie(
    tokenConfig.cookie.refreshTokenName,
    tokens.refreshToken,
    {
      httpOnly: true,
      secure: tokenConfig.cookie.secure,
      sameSite: tokenConfig.cookie.sameSite,
      domain: tokenConfig.cookie.domain,
      path: tokenConfig.cookie.path,
      maxAge: parseDurationToMs(
        tokenConfig.refreshTokenExpiresIn
      ),
    }
  );
};

export const clearAuthCookies = (res) => {
  res.clearCookie(tokenConfig.cookie.accessTokenName, {
    path: tokenConfig.cookie.path,
    domain: tokenConfig.cookie.domain,
  });

  res.clearCookie(tokenConfig.cookie.refreshTokenName, {
    path: tokenConfig.cookie.path,
    domain: tokenConfig.cookie.domain,
  });
};