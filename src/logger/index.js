function createLogger(appName) {
  const writers = {
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console),
    debug: console.debug.bind(console),
    trace: console.trace.bind(console),
  };

  function formatMessage(level, message, options = {}) {
    const timestamp = new Date().toISOString();
    const requestId = options.requestId ? `requestId = ${options.requestId}` : "";

    return `[${timestamp}] [${level.toUpperCase()}] [${appName}] ${requestId} ${message}`;
  }

  function log(level, message, options = {}) {
    const writer = writers[level] || console.log.bind(console);

    writer(formatMessage(level, message, options));
  }

  return {
    error(message, options) {
      log("error", message, options)
    },

    warn(message, options) {
      log("warn", message, options)
    },

    info(message, options) {
      log("info", message, options)
    },

    debug(message, options) {
      log("debug", message, options)
    },

    trace(message, options) {
      log("trace", message, options)
    },
  };
}

module.exports = createLogger;
