import Redis from 'ioredis';
import colors from 'colors';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD
});

  redisClient.on('connect', () => {
    console.log('Redis Connected Successfully'.rainbow.bold);
  });

  redisClient.on('error', (err) => {
    console.error('Redis connection failed:', err.message);
  });


  export default redisClient;