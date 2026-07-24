// Minimal structured logger for this module. Swap the console calls for your
// project's existing logger (winston/pino/etc.) if you have one — just keep
// the same `.info/.warn/.error(message, meta)` signature so the rest of the
// module keeps working unmodified.

const SENSITIVE_KEYS = ['captchaToken', 'secret', 'password', 'token'];

const redact = (meta = {}) => {
  const clone = { ...meta };
  for (const key of SENSITIVE_KEYS) {
    delete clone[key];
  }
  return clone;
};

const log = (level, message, meta = {}) => {
  const entry = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...redact(meta),
  };

  const line = JSON.stringify(entry);

  if (level === 'error') console.error(line);
  else if (level === 'warn') console.warn(line);
  else console.log(line);
};

export default {
  info: (message, meta) => log('info', message, meta),
  warn: (message, meta) => log('warn', message, meta),
  error: (message, meta) => log('error', message, meta),
};
