const AppError = require('./AppError');

class ConflictError extends AppError {
    constructor(message, context = {}) {
        super(message, {
            statusCode: 409,
            context,
        });
    }
}

module.exports = ConflictError;