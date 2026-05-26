const { AppError } = require('../errors');


function errorHandler (error, req, res, next) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            error: error.message,
            context: error.context,
        });
    }

    return res.status(500).json({
        error: 'Internal Server Error',
    });
}

module.exports = errorHandler;