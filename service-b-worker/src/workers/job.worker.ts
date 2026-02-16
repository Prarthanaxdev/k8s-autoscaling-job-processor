import redisClient from '../lib/redisClient.js';
import { QUEUE_NAME } from '../config/keys.js';
import { processJob } from '../services/jobProcessor.service.js';
import logger from '../lib/logger.js';

let isRunning = true;

export const stopWorker = () => {
  isRunning = false;
};

export const startWorker = async () => {
  logger.info('Worker started...');

  while (isRunning) {
    try {
      const result = await redisClient.brPop(QUEUE_NAME, 0);

      if (!result) continue;

      const jobId = result.element;

      logger.info(`Processing job: ${jobId}`);

      await processJob(jobId);
    } catch (error) {
      logger.error('Error in worker loop:', error);
    }
  }

  logger.info('Worker stopped gracefully');
};
