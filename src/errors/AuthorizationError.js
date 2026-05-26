const AppError = require('./AppError');

class AuthorizationError extends AppError {
    constructor(message = 'Forbidden', context = {}) {
        super(message, {
            statusCode: 403,
            context,
        });
    }
}

module.exports = AuthorizationError;