const config = require('./config');
const createLogger = require('./logger');
const startPriceSyncTask = require('./prices/price-sync.task');

const logger = createLogger(config.appName);

logger.info('Price synchronization worker started');

const priceSyncInterval = startPriceSyncTask(logger);

let isShuttingDown = false;

function shutdown(signal) {
  if (isShuttingDown) {
    return;
  }

  isShuttingDown = true;

  logger.info(`${signal} received. Stopping price synchronization worker`);

  clearInterval(priceSyncInterval);

  logger.info('Price synchronization worker stopped');
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));