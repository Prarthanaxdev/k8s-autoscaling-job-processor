import request from 'supertest';
import express from 'express';
import { getStats } from '../services/stats.service';

jest.mock('../services/stats.service');

const app = express();
app.get('/stats', async (req, res) => {
  const stats = await getStats();
  res.json(stats);
});

describe('/stats endpoint', () => {
  it('returns stats from service', async () => {
    (getStats as jest.Mock).mockResolvedValue({
      totalJobsSubmitted: 5,
      totalJobsCompleted: 3,
      queueLength: 2,
      averageProcessingTime: 7.5,
    });
    const res = await request(app).get('/stats');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      totalJobsSubmitted: 5,
      totalJobsCompleted: 3,
      queueLength: 2,
      averageProcessingTime: 7.5,
    });
  });
});
