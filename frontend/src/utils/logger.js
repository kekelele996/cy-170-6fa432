const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const CURRENT_LEVEL = LOG_LEVELS.INFO;

const PREFIX = '[PixelEditor]';

function format(level, args) {
  return [`${PREFIX} ${level}`, ...args];
}

export const logger = {
  debug: (...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.DEBUG) {
      console.debug(...format('DEBUG', args));
    }
  },
  info: (...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.INFO) {
      console.info(...format('INFO', args));
    }
  },
  warn: (...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.WARN) {
      console.warn(...format('WARN', args));
    }
  },
  error: (...args) => {
    if (CURRENT_LEVEL <= LOG_LEVELS.ERROR) {
      console.error(...format('ERROR', args));
    }
  }
};
