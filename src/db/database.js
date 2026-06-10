const sqlite3 = require('sqlite3');
const config = require('../config');
const createLogger = require('../logger');

const logger = createLogger(config.appName);

let db;

function getDatabase() {
    if (!db) {
        logger.info(`SQLite database connection opened: ${config.database.path}`);
        db = new sqlite3.Database(config.database.path);
    }

    return db;
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        getDatabase().run(sql, params, function (error) {
            if (error) {
                reject(error);
                return;
            }

            resolve({
                lastID: this.lastID,
                changes: this.changes,
            });
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        getDatabase().get(sql, params, (error, row) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(row);
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        getDatabase().all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(rows);
        });
    });
}

let transactionQueue = Promise.resolve();

async function executeTransaction(callback) {
    await run('BEGIN TRANSACTION');

    try {
        const result = await callback();
        await run('COMMIT');
        return result;
    } catch (error) {
        await run('ROLLBACK');
        logger.error(`Database transaction rolled back: ${error.message}`);
        throw error;
    }
}

function transaction(callback) {
    const queuedTransaction = transactionQueue.then(() => {
        return executeTransaction(callback);
    });

    transactionQueue = queuedTransaction.catch(() => {});

    return queuedTransaction;
}

module.exports = {
    run,
    get,
    all,
    transaction,
};