jest.mock('../scheduler');
jest.mock('./price-sync.service');

const config = require('../config');
const scheduleTask = require('../scheduler');
const priceSyncService = require('./price-sync.service');
const startPriceSyncTask = require('./price-sync.task');

function createTestLogger() {
    return {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
}

describe('startPriceSyncTask', () => {
    test('schedules price synchronization and logs saved price count', async () => {
        const logger = createTestLogger();
        const intervalId = Symbol('interval');

        scheduleTask.mockReturnValue(intervalId);
        priceSyncService.synchronizePrices.mockResolvedValue(5);

        const result = startPriceSyncTask(logger);

        expect(result).toBe(intervalId);
        expect(scheduleTask).toHaveBeenCalledWith(
            'price synchronization',
            config.scheduler.priceSyncInterval,
            expect.any(Function),
            logger,
            {
                runImmediately: true,
            },
        );

        const scheduledTask = scheduleTask.mock.calls[0][2];
        await scheduledTask();

        expect(priceSyncService.synchronizePrices).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith(
            'Price synchronization completed: 5 prices saved',
        );
    });
});