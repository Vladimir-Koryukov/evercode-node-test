const config = require('./config');
const createLogger = require('./logger');
const scheduleTask = require('./scheduler');

const logger = createLogger(config.appName);

logger.info("app started");

scheduleTask("running", config.scheduler.defaultInterval, () => {
  logger.info("running");
}, logger.info);