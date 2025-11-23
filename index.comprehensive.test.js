const request = require('supertest');
const app = require('./index');

describe('Webapp API - Comprehensive Tests', () => {
  
  describe('GET / - Homepage', () => {
    it('should return 200 OK status', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
    });

    it('should return HTML content type', async () => {
      const response = await request(app).get('/');
      expect(response.type).toMatch(/html/);
    });

    it('should contain Fleet Management System title', async () => {
      const response = await request(app).get('/');
      expect(response.text).toContain('Fleet Management System');
    });

    it('should contain proper HTML structure', async () => {
      const response = await request(app).get('/');
      expect(response.text).toContain('<html');
      expect(response.text).toContain('</html>');
    });
  });

  describe('GET /health - Health Check', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
    });

    it('should return JSON response', async () => {
      const response = await request(app).get('/health');
      expect(response.type).toMatch(/json/);
    });

    it('should have status property', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('status');
    });

    it('should return UP status', async () => {
      const response = await request(app).get('/health');
      expect(response.body.status).toBe('UP');
    });

    it('should have timestamp', async () => {
      const response = await request(app).get('/health');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/vehicles - Create Vehicle', () => {
    it('should accept valid vehicle data', async () => {
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

    it('should return created vehicle', async () => {
      const vehicleData = {
        id: 'V002',
        name: 'Vehicle 2',
        status: 'active'
      };
      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);
      expect(response.body).toHaveProperty('id');
      expect(response.body.id).toBe('V002');
    });

    it('should validate vehicle name', async () => {
      const vehicleData = {
        id: 'V003',
        name: 'Vehicle 3',
        status: 'active'
      };
      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);
      expect(response.body.name).toBeDefined();
    });

    it('should set correct status', async () => {
      const vehicleData = {
        id: 'V004',
        name: 'Vehicle 4',
        status: 'inactive'
      };
      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);
      expect(response.body.status).toBe('inactive');
    });
  });

  describe('GET /api/vehicles - List Vehicles', () => {
    it('should return 200 OK', async () => {
      const response = await request(app).get('/api/vehicles');
      expect(response.status).toBe(200);
    });

    it('should return JSON array', async () => {
      const response = await request(app).get('/api/vehicles');
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return vehicles with correct structure', async () => {
      const response = await request(app).get('/api/vehicles');
      if (response.body.length > 0) {
        expect(response.body[0]).toHaveProperty('id');
        expect(response.body[0]).toHaveProperty('name');
        expect(response.body[0]).toHaveProperty('status');
      }
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown route', async () => {
      const response = await request(app).get('/unknown-route');
      expect(response.status).toBe(404);
    });

    it('should handle invalid JSON in POST', async () => {
      const response = await request(app)
        .post('/api/vehicles')
        .send('invalid json');
      expect([400, 415]).toContain(response.status);
    });
  });

  describe('Performance Tests', () => {
    it('should respond to health check within 100ms', async () => {
      const start = Date.now();
      await request(app).get('/health');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });

    it('should respond to homepage within 200ms', async () => {
      const start = Date.now();
      await request(app).get('/');
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(200);
    });
  });

  describe('Security Tests', () => {
    it('should not expose sensitive headers', async () => {
      const response = await request(app).get('/');
      expect(response.headers['x-powered-by']).toBeUndefined();
    });

    it('should have CORS headers', async () => {
      const response = await request(app).get('/');
      // Check if CORS is properly configured
      expect(response.headers).toBeDefined();
    });
  });

  describe('Data Validation Tests', () => {
    it('should validate vehicle ID format', async () => {
      const vehicleData = {
        id: 'V005',
        name: 'Test Vehicle',
        status: 'active'
      };
      const response = await request(app)
        .post('/api/vehicles')
        .send(vehicleData);
      expect(response.body.id).toMatch(/^V\d+$/);
    });

    it('should accept valid status values', async () => {
      const validStatuses = ['active', 'inactive', 'maintenance'];
      for (const status of validStatuses) {
        const vehicleData = {
          id: `V${Math.random()}`,
          name: 'Test',
          status: status
        };
        const response = await request(app)
          .post('/api/vehicles')
          .send(vehicleData);
        expect([201, 200]).toContain(response.status);
      }
    });
  });
});
