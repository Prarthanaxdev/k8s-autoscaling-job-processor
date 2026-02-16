import { startWorker, stopWorker } from './workers/job.worker.js';
import redisClient from './lib/redisClient.js';
import logger from './lib/logger.js';
import { setupMetricsServer } from './lib/metrics.js';
import type { Server } from 'http';

let metricsServer: Server | null = null;
let isShuttingDown = false;

const startApp = async () => {
  try {
    // 1. Connect to Redis
    await redisClient.connect();
    logger.info('Redis connected successfully');

    // 2. Start Metrics Server
    const port = Number(process.env.METRICS_PORT);
    metricsServer = setupMetricsServer(port);
    logger.info('Metrics server started on port 9100');

    // 3. Start Worker (non-blocking)
    startWorker();
    logger.info('Worker started successfully');
  } catch (error) {
    logger.error('Failed to start worker:', error);
    process.exit(1);
  }
};

startApp();

// Graceful Shutdown
const shutdown = async (signal: string) => {
  stopWorker();
  if (isShuttingDown) return;
  isShuttingDown = true;

  logger.info(`Received ${signal}. Shutting down gracefully...`);

  try {
    // Stop worker loop
    stopWorker();
    // Close metrics server
    if (metricsServer) {
      metricsServer.close(() => {
        logger.info('Metrics server closed');
      });
    }

    // Close Redis connection
    await redisClient.quit();
    logger.info('Redis connection closed');

    process.exit(0);
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
