import express from 'express';
import client from 'prom-client';

// const collectDefaultMetrics = client.collectDefaultMetrics;
// collectDefaultMetrics();

export const jobsProcessedTotal = new client.Counter({
  name: 'jobs_processed_total',
  help: 'Total number of jobs processed',
});

export const jobErrorsTotal = new client.Counter({
  name: 'job_errors_total',
  help: 'Total number of failed jobs',
});

export const jobProcessingTimeSeconds = new client.Histogram({
  name: 'job_processing_time_seconds',
  help: 'Time taken to process jobs',
  buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Helper to observe processing time
export function addProcessingTime(duration: number) {
  jobProcessingTimeSeconds.observe(duration);
}

// Helper to increment jobs processed
export function incrementJobsProcessed() {
  jobsProcessedTotal.inc();
}

// Helper to increment job errors
export function incrementJobErrors() {
  jobErrorsTotal.inc();
}

export function setupMetricsServer(port = 9100) {
  const app = express();

  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
  });

  return app.listen(port);
}
