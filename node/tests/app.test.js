const request = require('supertest');
const app = require('../app'); // ודאי שהנתיב נכון ל-app.js שלך

describe('API sanity check', () => {
  test('GET /health returns 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
