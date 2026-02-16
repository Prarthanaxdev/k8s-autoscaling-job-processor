import request from 'supertest';
import express from 'express';
import * as client from 'prom-client';

const app = express();
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

describe('/metrics endpoint', () => {
  it('returns Prometheus metrics', async () => {
    // Register a test metric
    const testCounter = new client.Counter({
      name: 'total_jobs_submitted',
      help: 'Total jobs submitted',
    });
    testCounter.inc(5);
    const res = await request(app).get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('total_jobs_submitted');
  });
});
