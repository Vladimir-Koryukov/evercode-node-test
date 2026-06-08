const database = require('../db/database');
const { CREATE_CURRENCIES_TABLE } = require('../db/schema');

beforeAll(async () => {
    await database.run(CREATE_CURRENCIES_TABLE);
});