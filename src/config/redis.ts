import { createClient } from 'redis';

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
});

export const initRedis = async (): Promise<void> => {
  redisClient.on('error', err => {
    console.error('Redis error', err);
  });

  await redisClient.connect();
  console.log('Redis connected');
};

export default redisClient;