import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { config } from './config/keys.js';
import redisClient from './lib/redisClient.js';
import logger from './lib/logger.js';
import { apiKeyAuth } from './middleware/apiKeyAuth.js';
import { statsHandler } from './controller/stats.controller.js';
import { setupMetricsServer } from './lib/metrics.js';

dotenv.config();

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());

// Basic rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(apiKeyAuth);

// Stats route
app.get('/stats', statsHandler);

// Metrics endpoint
setupMetricsServer(app);

const PORT = config.PORT;

async function startServer() {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
    app.listen(PORT, () => {
      logger.info(`Service C listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
    process.exit(1);
  }
}

startServer();
