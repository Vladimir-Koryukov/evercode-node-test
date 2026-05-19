function createLogger(appName) {
  function log(level, message, options = {}) {
    const timestamp = new Date().toISOString();
    const requestId = options.requestId ? `requestId = ${options.requestId}` : "";

    console.log(`[${timestamp}] [${level.toUpperCase()}] [${appName}] ${requestId} ${message}`);
  };

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
