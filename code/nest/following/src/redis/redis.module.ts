import { Global, Logger, Module } from '@nestjs/common';
import { RedisService } from './redis.service';
import { createClient } from 'redis';

@Global()
@Module({
  providers: [
    RedisService,
    {
      provide: 'REDIS_CLIENT',
      async useFactory() {
        const logger = new Logger('RedisFactory');
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          },
        });

        try {
          await client.connect();
          logger.log('Redis client connected successfully');
          return client;
        } catch (error) {
          logger.error('Failed to connect to Redis', error);
          throw new Error('Redis connection failed');
        }
      },
    },
  ],
  exports: [RedisService],
})
export class RedisModule {}
