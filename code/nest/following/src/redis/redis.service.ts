import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  @Inject('REDIS_CLIENT')
  private redisClient: RedisClientType;

  // 添加数据
  async sAdd(key: string, ...members: string[]) {
    return this.redisClient.sAdd(key, members);
  }

  // 求两个数据的交集
  async sInterStore(newSetKey: string, set1: string, set2: string) {
    return this.redisClient.sInterStore(newSetKey, [set1, set2]);
  }

  // 判断一个元素是否在集合中
  async sIsMember(key: string, member: string) {
    return this.redisClient.sIsMember(key, member);
  }

  // 获取集合中的所有元素
  async sMember(key: string) {
    return this.redisClient.sMembers(key);
  }

  async exists(key: string) {
    const result = await this.redisClient.exists(key);
    return result > 0;
  }
}
