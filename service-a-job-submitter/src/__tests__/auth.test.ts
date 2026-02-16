process.env.API_KEY = 'test-key';
import request from 'supertest';
import express from 'express';
import jobRoutes from '../modules/job/routes';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const app = express();
app.use(express.json());
app.use(apiKeyAuth, jobRoutes);

describe('API Key Auth', () => {
  it('should reject requests without API key', async () => {
    const res = await request(app).post('/submit').send({ type: 'test', payload: {} });
    expect(res.status).toBe(401);
  });

  it('should accept requests with valid API key', async () => {
    const validJob = { name: 'Test Job', priority: 1 };
    const res = await request(app)
      .post('/submit')
      .send(validJob)
      .set('x-api-key', 'test-key');
    expect(res.status).not.toBe(401);
  });
});
