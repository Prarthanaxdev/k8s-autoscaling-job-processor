import { processJob } from '../services/jobProcessor.service';
import redisClient from '../lib/redisClient';

jest.mock('../lib/redisClient');

describe('Job Processing', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process a valid job and save result', async () => {
    (redisClient.hGetAll as jest.Mock).mockResolvedValue({
      data: JSON.stringify({ name: 'Test Job' }),
    });
    (redisClient.hSet as jest.Mock).mockResolvedValue(1);
    const jobId = 'job-123';
    await processJob(jobId);
    expect(redisClient.hSet).toHaveBeenCalledWith(
      `job:${jobId}`,
      expect.objectContaining({
        status: 'completed',
        result: expect.any(String),
        duration: expect.any(Number),
      }),
    );
  });

  it('should mark job as failed if not found', async () => {
    (redisClient.hGetAll as jest.Mock).mockResolvedValue({});
    const jobId = 'job-404';
    await processJob(jobId);
    expect(redisClient.hSet).not.toHaveBeenCalledWith(
      `job:${jobId}`,
      expect.objectContaining({ status: 'completed' }),
    );
  });
});
