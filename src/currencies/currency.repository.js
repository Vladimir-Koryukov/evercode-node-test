const database = require('../db/database');

function mapCurrency(row) {
    if (!row) {
        return null;
    }

    return {
        name: row.name,
        ticker: row.ticker,
    };
}

async function findAll() {
    const rows = await database.all(`
        SELECT name, ticker
        FROM currencies
        ORDER BY ticker    
    `);

    return rows.map(mapCurrency);
}

async function findByTicker(ticker) {
    const row = await database.get(`
        SELECT name, ticker
        FROM currencies
        WHERE ticker = ?    
    `, [ticker]
    );

    return mapCurrency(row);
}

async function create(currency) {
    return database.transaction(async () => {
        await database.run(`
            INSERT INTO currencies (ticker, name)
            VALUES (?, ?)
            `, [currency.ticker, currency.name]
        );

        return findByTicker(currency.ticker);
    });
}

async function update(ticker, newCurrency) {
    return database.transaction(async () => {
        const result = await database.run(`
            UPDATE currencies
            SET ticker = ?, name = ?
            WHERE ticker = ?
            `, [newCurrency.ticker, newCurrency.name, ticker]
        );

        if (result.changes === 0) {
            return null;
        }

        return findByTicker(newCurrency.ticker);
    });
}

async function remove(ticker) {
    return database.transaction(async () => {
        const result = await database.run(`
            DELETE FROM currencies
            WHERE ticker = ?
            `, [ticker]
        );

        return result.changes > 0;
    });
}

async function clear() {
    return database.run('DELETE FROM currencies');
}

module.exports = {
    findAll,
    findByTicker,
    create,
    update,
    remove,
    clear,
};