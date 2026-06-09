const scheduleTask = require('./index');
const { ValidationError } = require('../errors');

function createTestLogger() {
    return {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    };
}

describe('scheduleTask', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('throws ValidationError when name is empty', () => {
        const task = jest.fn();
        const logger = createTestLogger();

        expect(() => {
            scheduleTask('', 1000, task, logger);
        }).toThrow(ValidationError);
    });

    test('throws ValidationError when interval is not a positive number', () => {
        const task = jest.fn();
        const logger = createTestLogger();

        expect(() => {
            scheduleTask('running', -1000, task, logger);
        }).toThrow(ValidationError);
    });

    test('throws ValidationError when task is not a function', () => {
        const logger = createTestLogger();

        expect(() => {
            scheduleTask('running', 1000, 'not a function', logger);
        }).toThrow(ValidationError);
    });

    test('throws ValidationError when logger does not provide required methods', () => {
        const task = jest.fn();

        expect(() => {
            scheduleTask('running', 1000, task, null);
        }).toThrow(ValidationError);
    });

    test('executes scheduled task', async () => {
        const task = jest.fn();
        const logger = createTestLogger();

        const intervalId = scheduleTask('running', 1000, task, logger);

        jest.advanceTimersByTime(1000);
        await Promise.resolve();

        expect(task).toHaveBeenCalledTimes(1);
        expect(logger.info).toHaveBeenCalledWith(
            'Task "running" scheduled every 1000ms',
        );

        clearInterval(intervalId);
    });

    test('logs task error', async () => {
        const task = jest.fn().mockRejectedValue(new Error('test error'));
        const logger = createTestLogger();

        const intervalId = scheduleTask('running', 1000, task, logger);

        jest.advanceTimersByTime(1000);
        await Promise.resolve();
        await Promise.resolve();

        expect(logger.error).toHaveBeenCalledWith(
            'Task "running" failed: test error',
        );

        clearInterval(intervalId);
    });

    test('skips execution while previous task is still running', async () => {
        let finishTask;

        const task = jest.fn(() => {
            return new Promise((resolve) => {
                finishTask = resolve;
            });
        });

        const logger = createTestLogger();
        const intervalId = scheduleTask('running', 1000, task, logger);

        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);

        expect(task).toHaveBeenCalledTimes(1);
        expect(logger.warn).toHaveBeenCalledWith(
            'Task "running" skipped because previous execution is still running',
        );

        finishTask();
        await Promise.resolve();

        jest.advanceTimersByTime(1000);

        expect(task).toHaveBeenCalledTimes(2);

        clearInterval(intervalId);
    });
});
