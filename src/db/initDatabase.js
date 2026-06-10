const fs = require('fs');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const config = require('../config');
const createLogger = require('../logger');
const {
    CREATE_CURRENCIES_TABLE,
    CREATE_PRICES_TABLE,
} = require('./schema');

const logger = createLogger(config.appName);

const databasePath = config.database.path;
const databaseDir = path.dirname(databasePath);

fs.mkdirSync(databaseDir, { recursive: true });

const db = new sqlite3.Database(databasePath);

db.serialize(() => {
    db.run(CREATE_CURRENCIES_TABLE);
    db.run(CREATE_PRICES_TABLE);
});

db.close((error) => {
    if (error) {
        logger.error(`Failed to close database connection: ${error.message}`);
        process.exit(1);
    }

    logger.info('Database initialized successfully');
});