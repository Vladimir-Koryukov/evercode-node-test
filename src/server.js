const app = require('./app');
const config = require('./config');
const createLogger = require('./logger');

const logger = createLogger(config.appName);

const PORT = config.server.port;

app.listen(PORT, () => {
    logger.info(`Server started in http://localhost:${PORT}`);
});