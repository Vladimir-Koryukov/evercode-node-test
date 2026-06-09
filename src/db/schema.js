const CREATE_CURRENCIES_TABLE = `
    CREATE TABLE IF NOT EXISTS currencies(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL
    )
`;

const CREATE_PRICES_TABLE = `
    CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL UNIQUE,
        price TEXT NOT NULL,
        updated_at TEXT NOT NULL
    )
`;

module.exports = {
    CREATE_CURRENCIES_TABLE,
    CREATE_PRICES_TABLE,
};