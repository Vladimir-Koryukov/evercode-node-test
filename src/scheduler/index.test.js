const scheduleTask = require('./index');
const { ValidationError } = require('../errors');

describe('scheduleTask', () => {
    test('throws ValidationError when name is empty', () => {
        const task = jest.fn();
        const log = jest.fn();

        expect(() => {
            scheduleTask('', 1000, task, log);
        }).toThrow(ValidationError);
    });

    test('throws ValidationError when interval is not a positive number', () => {
        const task = jest.fn();
        const log = jest.fn();

        expect(() => {
            scheduleTask('running', -1000, task, log);
        }).toThrow(ValidationError);
    });

    test('throws ValidationError when task is not a function', () => {
        const log = jest.fn();

        expect(() => {
            scheduleTask('running', 1000, 'not a function', log);
        }).toThrow(ValidationError);
    });

    test('throws ValidationError when logger is not a function', () => {
        const task = jest.fn();

        expect(() => {
            scheduleTask('running', 1000, task, null);
        }).toThrow(ValidationError);
    });
});
