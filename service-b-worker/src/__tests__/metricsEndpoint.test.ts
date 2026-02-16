import { setupMetricsServer } from '../lib/metrics';
import request from 'supertest';

describe('/metrics endpoint', () => {
  let server: import('http').Server;
  afterEach((done) => {
    if (server) server.close(done);
  });

  it('should return Prometheus metrics', async () => {
    server = setupMetricsServer(9101); // Use a test port
    const res = await request('http://localhost:9101').get('/metrics');
    expect(res.status).toBe(200);
    expect(res.text).toContain('job_processing_time_seconds');
    expect(res.text).toContain('jobs_processed_total');
    expect(res.text).toContain('job_errors_total');
  });
});
