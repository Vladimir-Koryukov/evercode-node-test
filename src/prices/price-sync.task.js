const config = require('../config');
const scheduleTask = require('../scheduler');
const priceSyncService = require('./price-sync.service');

function startPriceSyncTask(logger) {
    return scheduleTask(
        'price synchronization',
        config.scheduler.priceSyncInterval,
        async () => {
            const savedPriceCount = await priceSyncService.synchronizePrices();

            logger.info(
                `Price synchronization completed: ${savedPriceCount} prices saved`,
            );
        },
        logger,
        {
            runImmediately: true,
        },
    );
}

module.exports = startPriceSyncTask;