const AppError = require('./AppError');

class ExternalApiError extends AppError {
    constructor(message = 'External API error', context = {}) {
        super(message, {
            statusCode: 502,
            context,
        });
    }
}

module.exports = ExternalApiError;