import redisClient from '../lib/redisClient';
import logger from '../lib/logger';
import bcrypt from 'bcryptjs';
import { addProcessingTime, incrementJobsProcessed, incrementJobErrors } from '../lib/metrics';

export const processJob = async (jobId: string) => {
  try {
    // 1. Get job data
    const job = await redisClient.hGetAll(`job:${jobId}`);

    if (!job || Object.keys(job).length === 0) {
      logger.warn(`Job ${jobId} not found`);
      return;
    }

    // 2. Update status → processing
    await redisClient.hSet(`job:${jobId}`, {
      status: 'processing',
    });

    logger.info(`Job ${jobId} is processing`);

    // 3. Simulate actual business logic (CPU-intensive)
    const jobData = JSON.parse(job.data);
    const jobType = jobData.type || Math.floor(Math.random() * 3); // 0: primes, 1: bcrypt, 2: sort
    let result: any;
    const start = Date.now();
    if (jobType === 0) {
      result = calculatePrimes(100000);
    } else if (jobType === 1) {
      result = await bcrypt.hash('password', 10);
    } else {
      result = generateAndSortArray(100000);
    }
    const duration = (Date.now() - start) / 1000;
    addProcessingTime(duration);
    incrementJobsProcessed();

    // 4. Update status → completed and save result
    await redisClient.hSet(`job:${jobId}`, {
      status: 'completed',
      result: JSON.stringify(result),
      duration,
    });
    logger.info(`Job ${jobId} completed successfully in ${duration}s`);
  } catch (error) {
    logger.error(`Job ${jobId} failed:`, error);
    incrementJobErrors();
    // 5. Update status → failed
    await redisClient.hSet(`job:${jobId}`, {
      status: 'failed',
    });
  }
};

function calculatePrimes(limit: number): number[] {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

function generateAndSortArray(size: number): number[] {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * size * 10));
  return arr.sort((a, b) => a - b);
}
