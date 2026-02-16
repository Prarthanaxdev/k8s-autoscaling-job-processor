import { createClient } from 'redis';
import dotenv from 'dotenv';
dotenv.config();

const redisClient = createClient({
	socket: {
		host: process.env.REDIS_HOST,
		port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT) : 6379,
	},
});

redisClient.on('error', (err) => console.error('Redis error:', err));

export default redisClient;
