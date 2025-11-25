//
//  routes.test.ts
//  
//
//  Created by Ujwal Yadav on 25/11/25.
//

import request from 'supertest';
import app from '../../src/index';

describe('Routes API', () => {
  it('GET /api/routes should return all routes', async () => {
    const res = await request(app).get('/api/routes');

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('POST /api/routes/:routeId/baseline should set baseline', async () => {
    const res = await request(app).post('/api/routes/R001/baseline');

    expect(res.status).toBe(200);
    expect(res.body.routeId).toBe('R001');
  });

  it('GET /api/routes/comparison should return comparison data', async () => {
    // First set baseline
    await request(app).post('/api/routes/R001/baseline');

    const res = await request(app).get('/api/routes/comparison');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('baseline');
    expect(res.body).toHaveProperty('comparisons');
  });
});

describe('Compliance API', () => {
  it('POST /api/compliance/cb should compute and save CB', async () => {
    const res = await request(app)
      .post('/api/compliance/cb')
      .send({
        shipId: 'SHIP001',
        year: 2025,
        actualIntensity: 88.0,
        fuelConsumption: 5000,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('cbGCO2eq');
    expect(res.body.cbGCO2eq).toBeGreaterThan(0);
  });
});

describe('Banking API', () => {
  it('POST /api/banking/bank should bank surplus', async () => {
    const res = await request(app)
      .post('/api/banking/bank')
      .send({
        shipId: 'SHIP001',
        year: 2025,
        amount: 1000,
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('amountGCO2eq');
  });

  it('POST /api/banking/bank should reject negative amount', async () => {
    const res = await request(app)
      .post('/api/banking/bank')
      .send({
        shipId: 'SHIP001',
        year: 2025,
        amount: -100,
      });

    expect(res.status).toBe(400);
  });
});

describe('Pooling API', () => {
  it('POST /api/pools should create valid pool', async () => {
    const res = await request(app)
      .post('/api/pools')
      .send({
        year: 2025,
        members: [
          { shipId: 'SHIP001', cbBefore: 1000 },
          { shipId: 'SHIP002', cbBefore: -400 },
        ],
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('poolId');
    expect(res.body.valid).toBe(true);
  });

  it('POST /api/pools should reject invalid pool', async () => {
    const res = await request(app)
      .post('/api/pools')
      .send({
        year: 2025,
        members: [
          { shipId: 'SHIP001', cbBefore: -1000 },
          { shipId: 'SHIP002', cbBefore: -500 },
        ],
      });

    expect(res.status).toBe(400);
  });
});
