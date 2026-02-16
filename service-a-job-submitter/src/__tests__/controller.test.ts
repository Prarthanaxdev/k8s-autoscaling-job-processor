import request from 'supertest';
import express from 'express';
import jobRoutes from '../modules/job/routes';
import redisClient from '../lib/redisClient';
import { apiKeyAuth } from '../middleware/apiKeyAuth';

const app = express();
app.use(express.json());
app.use(apiKeyAuth, jobRoutes);

process.env.API_KEY = 'test-key';

describe('Job API', () => {
  describe('POST /submit', () => {
    it('should return jobId for valid job', async () => {
      jest.spyOn(redisClient, 'rPush').mockResolvedValue(1);
      jest.spyOn(redisClient, 'hSet').mockResolvedValue(1);
      const validJob = { name: 'Test Job', priority: 1 };
      const res = await request(app).post('/submit').send(validJob).set('x-api-key', 'test-key');
      expect(res.status).toBe(200);
      expect(res.body.jobId).toBeDefined();
    });

    it('should return 400 for invalid job', async () => {
      const res = await request(app).post('/submit').send({}).set('x-api-key', 'test-key');
      expect(res.status).toBe(400);
    });

    it('should return 500 if Redis fails', async () => {
      jest.spyOn(redisClient, 'rPush').mockRejectedValue(new Error('Redis error'));
      const validJob = { name: 'Test Job', priority: 1 };
      const res = await request(app).post('/submit').send(validJob).set('x-api-key', 'test-key');
      expect(res.status).toBe(500);
    });
  });

  describe('GET /status/:id', () => {
    it('should return job status for existing job', async () => {
      jest.spyOn(redisClient, 'hGetAll').mockResolvedValue({ status: 'queued', data: '{}' });
      const res = await request(app).get('/status/123').set('x-api-key', 'test-key');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('queued');
    });

    it('should return 404 for non-existent job', async () => {
      jest.spyOn(redisClient, 'hGetAll').mockResolvedValue({});
      const res = await request(app).get('/status/doesnotexist').set('x-api-key', 'test-key');
      expect(res.status).toBe(404);
    });

    it('should return 500 if Redis fails', async () => {
      jest.spyOn(redisClient, 'hGetAll').mockRejectedValue(new Error('Redis error'));
      const res = await request(app).get('/status/123').set('x-api-key', 'test-key');
      expect(res.status).toBe(500);
    });
  });
});
