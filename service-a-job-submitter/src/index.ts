import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

import jobRoutes from './modules/job/routes';
import { apiKeyAuth } from './middleware/apiKeyAuth';
import dotenv from 'dotenv';
import { config } from './config/keys';
import morganMiddleware from './middleware/morganMiddleware';
import logger from './lib/logger';
import swaggerUi from 'swagger-ui-express';
const swaggerSpec = require('./lib/swagger');
import redisClient from './lib/redisClient';

dotenv.config();

const corsOptions = {
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
};

const app = express();
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(morganMiddleware as any);

// Swagger API docs route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Basic rate limiter: 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use(apiKeyAuth);
// Job routes
app.use('/api/jobs', jobRoutes);

const PORT = config.PORT || 3000;

async function startServer() {
  try {
    await redisClient.connect();
    logger.info('Redis connected successfully');
    app.listen(PORT, () => {
      logger.info(`Service A listening on port ${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to connect to Redis:', err);
    process.exit(1);
  }
}

startServer();
