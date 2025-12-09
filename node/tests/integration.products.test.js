// מונעים גישה ל-Firebase אמיתי
jest.mock('../firebase');

// מונעים כל גישה אמיתית למסד
jest.mock('../models/data', () => ({
  find: jest.fn(() =>
    Promise.resolve([
      { name: 'Mock item 1', price: 20 },
      { name: 'Mock item 2', price: 30 },
    ])
  ),
}));

const request = require('supertest');
const app = require('../app');

describe('Integration Test - /products', () => {
  test(
    'GET /products returns 200 and a list',
    async () => {
      const res = await request(app).get('/products');

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].name).toBe('Mock item 1');
    },
    30000
  );
});




