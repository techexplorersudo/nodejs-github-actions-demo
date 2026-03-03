const { app, greet } = require('./index');
const request = require('supertest');

describe('Greet Function', () => {
  test('should return greeting message', () => {
    expect(greet('World')).toBe('Hello, World!');
  });

  test('should greet with different names', () => {
    expect(greet('Alice')).toBe('Hello, Alice!');
    expect(greet('Bob')).toBe('Hello, Bob!');
  });
});

describe('Express App', () => {
  test('GET / should return welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Welcome to Node.js GitHub Actions Demo!');
  });

  test('GET /health should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('OK');
  });
});