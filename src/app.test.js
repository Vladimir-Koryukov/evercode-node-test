const request = require('supertest');
const app = require('./app');

describe('GET /status', () => {
  test('returns ok', async () => {
    const response = await request(app).get('/status');

    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('ok');
  });
});