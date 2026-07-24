import { subscribeEmail } from '../services/subscribe.service.js';
import logger from '../utils/logger.js';

export const subscribeController = async (req, res, next) => {
  try {
    const { email } = req.body;
    const ipAddress = req.ip;
    const userAgent = (req.get('user-agent') || '').slice(0, 512);

    await subscribeEmail({
      email,
      ipAddress,
      userAgent,
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for subscribing.',
    });
  } catch (err) {
    logger.error('Subscription failed', {
      ip: req.ip,
      error: err.message,
    });

    next(err);
  }
};