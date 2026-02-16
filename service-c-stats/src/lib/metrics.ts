import client from 'prom-client';
import express from 'express';
import { getStats } from '../services/stats.service';

export const totalJobsSubmitted = new client.Gauge({
  name: 'total_jobs_submitted',
  help: 'Total jobs submitted',
});

export const totalJobsCompleted = new client.Gauge({
  name: 'total_jobs_completed',
  help: 'Total jobs completed',
});

export const queueLengthGauge = new client.Gauge({
  name: 'queue_length',
  help: 'Current queue length',
});

export const setupMetricsServer = (app: express.Express) => {
  app.get('/metrics', async (req, res) => {
    const stats = await getStats();

    totalJobsSubmitted.set(stats.totalJobsSubmitted);
    totalJobsCompleted.set(stats.totalJobsCompleted);
    queueLengthGauge.set(stats.queueLength);

    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });
};
