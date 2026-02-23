import { getStats } from '../services/stats.service';

jest.mock('../lib/redisClient', () => ({
  __esModule: true,
  default: {
    lLen: jest.fn(),
    keys: jest.fn(),
    hGetAll: jest.fn(),
  },
}));

const redisClient = require('../lib/redisClient').default;

describe('getStats', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns zeroes when no jobs', async () => {
    redisClient.lLen.mockResolvedValue(0);
    redisClient.keys.mockResolvedValue([]);
    const stats = await getStats();
    expect(stats).toEqual({
      totalJobsSubmitted: 0,
      totalJobsCompleted: 0,
      queueLength: 0,
      averageProcessingTime: 0,
    });
  });

  it('returns correct stats for completed jobs', async () => {
    redisClient.lLen.mockResolvedValue(2);
    redisClient.keys.mockResolvedValue(['job:1', 'job:2']);
    redisClient.hGetAll
      .mockResolvedValueOnce({ status: 'completed', duration: '5' })
      .mockResolvedValueOnce({ status: 'completed', duration: '15' });
    const stats = await getStats();
    expect(stats).toEqual({
      totalJobsSubmitted: 2,
      totalJobsCompleted: 2,
      queueLength: 2,
      averageProcessingTime: 10,
    });
  });

  it('handles jobs with mixed status', async () => {
    redisClient.lLen.mockResolvedValue(3);
    redisClient.keys.mockResolvedValue(['job:1', 'job:2', 'job:3']);
    redisClient.hGetAll
      .mockResolvedValueOnce({ status: 'completed', duration: '8' })
      .mockResolvedValueOnce({ status: 'processing' })
      .mockResolvedValueOnce({ status: 'completed', duration: '12' });
    const stats = await getStats();
    expect(stats).toEqual({
      totalJobsSubmitted: 3,
      totalJobsCompleted: 2,
      queueLength: 3,
      averageProcessingTime: 10,
    });
  });
});
