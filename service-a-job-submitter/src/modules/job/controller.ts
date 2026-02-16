import { Request, Response } from 'express';
import { jobSchema, JobData } from './job.schema';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../../config/keys';
import redisClient from '../../lib/redisClient';
import logger from '../../lib/logger';

/**
 * Handles job submission.
 * @param req Express request
 * @param res Express response
 * @returns Job ID if successful, error otherwise
 */
export const submitJob = async (req: Request, res: Response) => {
  const parseResult = jobSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid job data', details: parseResult.error.issues });
  }
  const jobData: JobData = parseResult.data;
  const jobId = uuidv4();
  try {
    await redisClient.rPush(config.QUEUE_NAME, jobId);
    await redisClient.hSet(`job:${jobId}`, {
      status: 'queued',
      data: JSON.stringify(jobData),
    });
    logger.info(`Job submitted: ${jobId}`);

    res.json({ jobId });
  } catch (err) {
    logger.error('Submit job error:', err);
    res.status(500).json({ error: 'Failed to submit job' });
  }
};

/**
 * Retrieves job status by ID.
 * @param req Express request
 * @param res Express response
 * @returns Job status and data if found, error otherwise
 */
export const getJobStatus = async (req: Request, res: Response) => {
  const jobId = req.params.id;
  try {
    const job = await redisClient.hGetAll(`job:${jobId}`);
    if (!job || Object.keys(job).length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    res.json({
      status: job.status,
      data: job.data ? JSON.parse(job.data) : undefined,
    });
  } catch (err) {
    logger.error('Get job error:', err);
    res.status(500).json({ error: 'Failed to get job status' });
  }
};
