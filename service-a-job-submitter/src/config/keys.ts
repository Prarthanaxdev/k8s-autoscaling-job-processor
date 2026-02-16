import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

const REQUIRED_ENV_VARS = ['PORT', 'REDIS_HOST', 'REDIS_PORT', 'QUEUE_NAME'];
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);
if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

export const config = {
  PORT: process.env.PORT ? parseInt(process.env.PORT) : 4000,
  REDIS_HOST: process.env.REDIS_HOST!,
  REDIS_PORT: process.env.REDIS_PORT!,
  QUEUE_NAME: process.env.QUEUE_NAME!,
};
