const AppError = require('./AppError');

class NotFoundError extends AppError {
    constructor(message, context = {}) {
        super(message, {
            statusCode: 404,
            context,
        });
    }
}

module.exports = NotFoundError;