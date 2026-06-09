const database = require('../db/database');

function mapPrice(row) {
    return {
        symbol: row.symbol,
        price: row.price,
    };
}

async function findByCurrencyTicker(ticker) {
    const rows = await database.all(`
        SELECT symbol, price
        FROM prices
        WHERE instr(symbol, ?) > 0
        ORDER BY symbol
    `, [ticker]);

    return rows.map(mapPrice);
}

async function replaceAll(prices, updatedAt) {
    return database.transaction(async () => {
        await database.run('DELETE FROM prices');

        for (const price of prices) {
            await database.run(`
                INSERT INTO prices (symbol, price, updated_at)
                VALUES (?, ?, ?)
            `, [price.symbol, price.price, updatedAt]);
        }
    });
}

async function clear() {
    return database.run('DELETE FROM prices');
}

module.exports = {
    findByCurrencyTicker,
    replaceAll,
    clear,
};