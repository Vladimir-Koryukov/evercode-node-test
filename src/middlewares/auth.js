const config = require('../config');
const { AppError, AuthorizationError} = require('../errors');

function authMiddleware(req, res, next) {
    const expectedToken = config.auth.token;
    const authorizationToken = req.get('authorization');

    if (!expectedToken || expectedToken.length !== 64) {
        return next(new AppError('expectedToken is not configured', {
            statusCode: 500,
        }));
    }

    if (!authorizationToken) {
        return next(new AuthorizationError('Forbidden'));
    }

    const [type, token] = authorizationToken.split(' ');
    if (type !== 'Bearer' || token !== expectedToken) {
        return next(new AuthorizationError('Forbidden'));
    }

    next();
}

module.exports = authMiddleware;