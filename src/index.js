const config = require('./config');
const createLogger = require('./logger');
const startPriceSyncTask = require('./prices/price-sync.task');

const logger = createLogger(config.appName);

logger.info('Price synchronization worker started');

startPriceSyncTask(logger);