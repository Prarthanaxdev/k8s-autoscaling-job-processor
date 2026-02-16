import redisClient from '../lib/redisClient';
import { config } from '../config/keys';

export const getStats = async () => {
  // 1. Get queue length
  const queueLength = await redisClient.lLen(config.QUEUE_NAME);

  // 2. Get all job keys
  const keys = await redisClient.keys('job:*');

  let totalJobsSubmitted = keys.length;
  let totalJobsCompleted = 0;
  let totalDuration = 0;

  for (const key of keys) {
    const job = (await redisClient.hGetAll(key)) as Record<string, any>;

    if (job.status === 'completed') {
      totalJobsCompleted++;
      totalDuration += Number(job.duration || 0);
    }
  }

  const avgTime = totalJobsCompleted > 0 ? totalDuration / totalJobsCompleted : 0;

  return {
    totalJobsSubmitted,
    totalJobsCompleted,
    queueLength,
    averageProcessingTime: avgTime,
  };
};
