const request = require('supertest');
const app = require('./index');

describe('Webapp API', () => {
  describe('GET /', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    it('should return HTML content', async () => {
      const response = await request(app).get('/');
      expect(response.text).toContain('Fleet Management System');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toBe('UP');
    });
  });

  describe('POST /api/vehicles', () => {
    it('should accept vehicle data', async () => {
      const vehicleData = {
        id: 'V001',
        name: 'Vehicle 1',
        status: 'active'
      };
      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);
      expect(response.status).toBe(201);
    });
  });
});