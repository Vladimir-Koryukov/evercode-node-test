const database = require('../db/database');
const {
    CREATE_CURRENCIES_TABLE,
    CREATE_PRICES_TABLE,
} = require('../db/schema');

beforeAll(async () => {
    await database.run(CREATE_CURRENCIES_TABLE);
    await database.run(CREATE_PRICES_TABLE);
});