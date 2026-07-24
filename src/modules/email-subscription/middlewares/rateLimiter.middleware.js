import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import logger from '../utils/logger.js';

const windowMs =
  parseInt(process.env.SUBSCRIBE_RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000;

const max =
  parseInt(process.env.SUBSCRIBE_RATE_LIMIT_MAX_REQUESTS, 10) || 5;

export const subscribeRateLimiter = rateLimit({
  windowMs,
  max,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => ipKeyGenerator(req.ip),
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.originalUrl,
    });

    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.',
    });
  },
});