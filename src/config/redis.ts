// import 'dotenv/config';
// import { createClient } from 'redis';

// export const redisConnection = {
//   host: process.env.REDIS_HOST,
//   port: Number(process.env.REDIS_PORT)
// };

// const redisClient = createClient({
//   socket: redisConnection
// });

// export const initRedis = async (): Promise<void> => {
//   redisClient.on('error', err => {
//     console.error('Redis error', err);
//   });

//   await redisClient.connect();
//   console.log('Redis connected');
// };

// export default redisClient;


import 'dotenv/config';
import { RedisOptions } from 'ioredis';

export const redisConnection: RedisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT
    ? Number(process.env.REDIS_PORT)
    : 6379,
  // password: process.env.REDIS_PASSWORD || undefined
};
