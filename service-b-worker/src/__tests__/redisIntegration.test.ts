import net from 'net';
import redisClient, { initRedisClient } from '../lib/redisClient';

function isRedisAvailable(port = 6379, host = '127.0.0.1', timeout = 500) {
  return new Promise<boolean>((resolve) => {
    const socket = net.createConnection(port, host);
    socket.setTimeout(timeout);
    socket.on('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
    socket.on('timeout', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

describe('Redis Integration', () => {
  let connected = false;
  let redisAvailable = false;

  beforeAll(async () => {
    redisAvailable = await isRedisAvailable();
  });

  afterAll(async () => {
    if (connected && redisClient.isOpen) {
      await redisClient.quit();
    }
  });

  it('should connect and quit without error', async () => {
    if (!redisAvailable) {
      console.warn('Redis not available, skipping test.');
      return;
    }
    await expect(initRedisClient()).resolves.not.toThrow();
    connected = true;
    await expect(redisClient.quit()).resolves.not.toThrow();
  }, 15000); // 15 seconds timeout for this test
});
