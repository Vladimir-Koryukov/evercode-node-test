const request = require('supertest');
const app = require('../app');
const currencyService = require('./currency.service');

const validToken = process.env.AUTHORIZATION_TOKEN;
const authHeader = `Bearer ${validToken}`;

describe('currency routes', () => {
    beforeEach(() => {
        currencyService.clearAll();
    });

    test('creates, reads, updates and deletes currency', async () => {
        const createResponse = await request(app)
            .post('/currencies')
            .set('Authorization', authHeader)
            .send({
                name: 'Bitcoin',
                ticker: 'BTC',
            });

        expect(createResponse.statusCode).toBe(201);
        expect(createResponse.body).toEqual({
            name: 'Bitcoin',
            ticker: 'BTC',
        });

        const listResponse = await request(app)
            .get('/currencies')
            .set('Authorization', authHeader);

        expect(listResponse.statusCode).toBe(200);
        expect(listResponse.body).toEqual([
            {
                name: 'Bitcoin',
                ticker: 'BTC',
            },
        ]);

        const updateResponse = await request(app)
            .put('/currencies/BTC')
            .set('Authorization', authHeader)
            .send({
                name: 'Ethereum',
                ticker: 'ETH',
        });

        expect(updateResponse.statusCode).toBe(200);
        expect(updateResponse.body).toEqual({
            name: 'Ethereum',
            ticker: 'ETH',
        });

        const deleteResponse = await request(app)
            .delete('/currencies/ETH')
            .set('Authorization', authHeader);

        expect(deleteResponse.statusCode).toBe(204);
    });

    test('returns 403 without authorization token', async () => {
        const response = await request(app).get('/currencies');

        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe('Forbidden');
    });

    test('returns 404 when currency does not exist', async () => {
        const response = await request(app)
            .get('/currencies/BTC')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(404);
        expect(response.body.error).toBe('Currency is not found');
    });

    test('finds currency by ticker ignoring case', async () => {
        await request(app)
            .post('/currencies')
            .set('Authorization', authHeader)
            .send({
                name: 'Bitcoin',
                ticker: 'btc',
            });

        const response = await request(app)
            .get('/currencies/BtC')
            .set('Authorization', authHeader);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            name: 'Bitcoin',
            ticker: 'BTC',
        });
    });
});