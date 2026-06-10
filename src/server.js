const app = require('./app');
const config = require('./config');
const createLogger = require('./logger');
const startPriceSyncTask = require('./prices/price-sync.task');

const logger = createLogger(config.appName);

const PORT = config.server.port;

const server = app.listen(PORT, () => {
    logger.info(`Server started in http://localhost:${PORT}`);
});

const priceSyncInterval = startPriceSyncTask(logger);

let isShuttingDown = false;

function shutdown(signal) {
    if (isShuttingDown) {
        return;
    }

    isShuttingDown = true;

    logger.info(`${signal} received. Shutting down application`);

    clearInterval(priceSyncInterval);

    server.close((error) => {
        if (error) {
            logger.error(`Failed to stop server: ${error.message}`);
            process.exitCode = 1;
            return;
        }

        logger.info('Application stopped successfully');
    });
}

process.once('SIGINT', () => shutdown('SIGINT'));
process.once('SIGTERM', () => shutdown('SIGTERM'));