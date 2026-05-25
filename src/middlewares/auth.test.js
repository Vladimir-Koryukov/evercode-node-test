const validToken = 'a'.repeat(64);

process.env.AUTHORIZATION_TOKEN = validToken;

const express = require('express');
const request = require('supertest');
const authMiddleware = require('./auth');
const errorHandler = require('./errorHandler');

const app = express();

app.get('/private', authMiddleware, (req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

describe('authMiddleware', () => {
    test('allows request with valid token', async () => {
        const response = await request(app)
            .get('/private')
            .set('Authorization', `Bearer ${validToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ ok: true });
    });

    test('returns 403 when authorization header is missing', async () => {
        const response = await request(app).get('/private');

        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe('Forbidden');
    });

    test('returns 403 when token is invalid', async () => {
        const response = await request(app)
            .get('/private')
            .set('Authorization', `Bearer ${'b'.repeat(64)}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.error).toBe('Forbidden');
    });
});