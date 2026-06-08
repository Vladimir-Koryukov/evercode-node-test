const CREATE_CURRENCIES_TABLE = `
    CREATE TABLE IF NOT EXISTS currencies(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ticker TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL
    )
`;

module.exports = {
    CREATE_CURRENCIES_TABLE,
};