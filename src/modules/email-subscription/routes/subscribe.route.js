import { Router } from 'express';
import { subscribeController } from '../controllers/subscribe.controller.js';
import { validateSubscribe } from '../validations/subscribe.validation.js';
import { verifyTurnstile } from '../middlewares/turnstile.middleware.js';
import { subscribeRateLimiter } from '../middlewares/rateLimiter.middleware.js';

const router = Router();

// Order matters:
// 1. Rate limiter first  — cheapest check, blocks abusive IPs before any
//    other work (validation, outbound CAPTCHA call, DB access) happens.
// 2. Validation           — reject malformed/unexpected input before we
//    spend a network round-trip verifying CAPTCHA.
// 3. CAPTCHA verification — external call, only run on well-formed requests.
// 4. Controller           — business logic, only reached by requests that
//    passed every prior gate.
router.post(
  '/subscribe',
  subscribeRateLimiter,
  validateSubscribe,
  verifyTurnstile,
  subscribeController
);

export default router;
