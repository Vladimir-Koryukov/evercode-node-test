const AppError = require('./AppError');

class SchedulerError extends AppError {
    constructor(message, context = {}) {
        super(message, {
            statusCode: 500,
            context,
        });
    }
}

module.exports = SchedulerError;