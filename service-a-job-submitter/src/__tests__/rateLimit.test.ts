import request from 'supertest';
import express from 'express';
import rateLimit from 'express-rate-limit';
import jobRoutes from '../modules/job/routes';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const limiter = rateLimit({
  windowMs: 1000, // 1 second for test
  max: 2,
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
app.use(express.json());
app.use(limiter);
app.use(apiKeyAuth, jobRoutes);

describe('Rate Limiting', () => {
  it('should allow up to max requests', async () => {
    for (let i = 0; i < 2; i++) {
      const res = await request(app)
        .post('/submit')
        .send({ type: 'test', payload: {} })
        .set('x-api-key', 'test-key');
      expect(res.status).not.toBe(429);
    }
  });

  it('should block after max requests', async () => {
    for (let i = 0; i < 2; i++) {
      await request(app)
        .post('/submit')
        .send({ type: 'test', payload: {} })
        .set('x-api-key', 'test-key');
    }
    const res = await request(app)
      .post('/submit')
      .send({ type: 'test', payload: {} })
      .set('x-api-key', 'test-key');
    expect(res.status).toBe(429);
  });
});
