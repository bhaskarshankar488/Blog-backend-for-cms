import axios from 'axios';
import logger from '../utils/logger.js';

const TURNSTILE_VERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

// Verifies the Turnstile token server-side. Cloudflare's siteverify endpoint
// itself rejects tokens that are expired, already-used, or malformed/invalid
// (returned as `error-codes` such as `timeout-or-duplicate`), so we never
// need to (and never should try to) implement our own token-replay cache —
// Cloudflare is the source of truth for token validity.
export const verifyTurnstile = async (req, res, next) => {
  const { captchaToken } = req.body;
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    // Fail closed: a misconfigured server must not silently accept requests.
    logger.error('TURNSTILE_SECRET_KEY is not configured');
    return res.status(500).json({
      success: false,
      message: 'Server configuration error',
    });
  }

  if (!captchaToken) {
    return res.status(400).json({
      success: false,
      message: 'CAPTCHA token is required',
    });
  }

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', captchaToken);
    if (req.ip) params.append('remoteip', req.ip);

    const { data } = await axios.post(TURNSTILE_VERIFY_URL, params, {
      timeout: 5000,
    });

    if (!data || data.success !== true) {
      logger.warn('CAPTCHA verification failed', {
        ip: req.ip,
        errorCodes: (data && data['error-codes']) || [],
      });
      return res.status(400).json({
        success: false,
        message: 'CAPTCHA verification failed',
      });
    }

    next();
  } catch (err) {
    // Network/timeout error talking to Cloudflare — fail closed, don't leak
    // internal error details to the client.
    logger.error('CAPTCHA verification error', {
      ip: req.ip,
      error: err.message,
    });
    return res.status(502).json({
      success: false,
      message: 'Unable to verify CAPTCHA at this time. Please try again.',
    });
  }
};
