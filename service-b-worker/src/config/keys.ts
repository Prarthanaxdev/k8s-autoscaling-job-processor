import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const REQUIRED_ENV_VARS = ['REDIS_URL', 'QUEUE_NAME', 'METRICS_PORT'];

const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export const REDIS_URL = process.env.REDIS_URL || 'redis://redis:6379';
export const QUEUE_NAME = process.env.QUEUE_NAME!;
export const METRICS_PORT = Number(process.env.METRICS_PORT!);
