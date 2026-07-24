import Subscriber from '../models/subscriber.model.js';
import logger from '../utils/logger.js';

export const subscribeEmail = async ({ email, ipAddress, userAgent }) => {
  try {
    const subscriber = await Subscriber.create({
      email,
      ipAddress,
      userAgent,
    });

    logger.info('New subscriber created', {
      email,
      ip: ipAddress,
    });

    return { created: true, subscriber };
  } catch (err) {
    if (err?.code === 11000) {
      logger.warn('Duplicate subscription attempt', {
        email,
        ip: ipAddress,
      });

      // Don't expose this to the client
      return { created: false };
    }

    throw err;
  }
};