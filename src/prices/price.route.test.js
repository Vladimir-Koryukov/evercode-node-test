const request = require('supertest');
const app = require('../app');
const currencyService = require('../currencies/currency.service');

const validToken = process.env.AUTHORIZATION_TOKEN;
const authHeader = `Bearer ${validToken}`;

describe('price routes', () => {
    beforeEach(async () => {
        await currencyService.clearAll();

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => [
                { symbol: 'BTCUSDT', price: '70000.00' },
                { symbol: 'ETHBTC', price: '0.03' },
                { symbol: 'ETHUSDT', price: '2100.00' },
            ],
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('returns prices that include requested currency ticker', async () => {
        await currencyService.createCurrency({
            name: 'Bitcoin',
            ticker: 'BTC',
        });

        const response = await request(app)
            .get('/price?currency=btc')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([
            { symbol: 'BTCUSDT', price: '70000.00' },
            { symbol: 'ETHBTC', price: '0.03' },
        ]);
    });

    test('returns 400 when currency query parameter is missing', async () => {
        const response = await request(app)
            .get('/price')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(400);
        expect(response.body.error).toBe('Currency query parameter should be string and is required');
    });

    test('returns 404 when currency ticker does not exist in storage', async () => {
        const response = await request(app)
            .get('/price?currency=BTC')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Currency is not found');
    });
});
