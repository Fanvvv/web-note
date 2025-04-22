import { Inject, Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { User } from './entities/user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class UserService {
  @InjectEntityManager()
  private readonly entityManager: EntityManager;

  @Inject(RedisService)
  private redisService: RedisService;

  async follow(userId: number, userId2: number) {
    const user = await this.entityManager.findOne(User, {
      where: {
        id: userId,
      },
      relations: ['followers', 'following'],
    });

    const user2 = await this.entityManager.findOne(User, {
      where: {
        id: userId2,
      },
    });

    if (user2) {
      user?.followers.push(user2);
    }

    if (user) {
      await this.entityManager.save(User, user);
    }

    const exists = await this.redisService.exists('followers:' + userId);

    if (exists) {
      await this.redisService.sAdd('followers:' + userId, userId2.toString());
      await this.redisService.sInterStore(
        'follow-each-other:' + userId,
        'followers:' + userId,
        'following:' + userId,
      );
    }

    const exists2 = await this.redisService.exists('following:' + userId2);

    if (exists2) {
      await this.redisService.sAdd('following:' + userId2, userId.toString());
      await this.redisService.sInterStore(
        'follow-each-other:' + userId2,
        'followers:' + userId2,
        'following:' + userId2,
      );
    }
  }

  async findUserByIds(userIds: string[] | number[]) {
    let users: Array<User | null> = [];

    for (let i = 0; i < userIds.length; i++) {
      const user = await this.entityManager.findOne(User, {
        where: {
          id: +userIds[i],
        },
      });
      users.push(user);
    }

    return users;
  }

  async getFollowRelationship(userId: number) {
    // 检查 Redis 中是否存在用户的关注者和被关注者信息
    const exists = await this.redisService.exists('followers:' + userId);
    if (!exists) {
      // 如果不存在，则从数据库中查询用户及其关注者和被关注者信息
      const user = await this.entityManager.findOne(User, {
        where: {
          id: userId,
        },
        relations: ['followers', 'following'],
      });

      // 如果用户没有关注者或被关注者，则直接返回空数组
      if (!user?.followers.length || !user?.following.length) {
        return {
          followers: user?.followers,
          following: user?.following,
          followEachOther: [],
        };
      }

      // 将关注者 ID 存储到 Redis 中
      await this.redisService.sAdd(
        'followers:' + userId,
        ...user.followers.map((item) => item.id.toString()),
      );

      // 将被关注者 ID 存储到 Redis 中
      await this.redisService.sAdd(
        'following:' + userId,
        ...user.following.map((item) => item.id.toString()),
      );

      // 计算互相关注的用户 ID 并存储到 Redis 中
      await this.redisService.sInterStore(
        'follow-each-other:' + userId,
        'followers:' + userId,
        'following:' + userId,
      );

      // 获取互相关注的用户 ID
      const followEachOtherIds = await this.redisService.sMember(
        'follow-each-other:' + userId,
      );

      // 根据互相关注的用户 ID 查询用户信息
      const followEachOtherUsers = await this.findUserByIds(followEachOtherIds);

      // 返回用户的关注者、被关注者和互相关注的用户信息
      return {
        followers: user.followers,
        following: user.following,
        followEachOther: followEachOtherUsers,
      };
    } else {
      // 如果 Redis 中存在用户的关注者和被关注者信息，则从 Redis 中获取
      const followerIds = await this.redisService.sMember(
        'followers:' + userId,
      );

      // 根据关注者 ID 查询用户信息
      const followUsers = await this.findUserByIds(followerIds);

      const followingIds = await this.redisService.sMember(
        'following:' + userId,
      );

      // 根据被关注者 ID 查询用户信息
      const followingUsers = await this.findUserByIds(followingIds);

      const followEachOtherIds = await this.redisService.sMember(
        'follow-each-other:' + userId,
      );

      // 根据互相关注的用户 ID 查询用户信息
      const followEachOtherUsers = await this.findUserByIds(followEachOtherIds);

      // 返回用户的关注者、被关注者和互相关注的用户信息
      return {
        followers: followUsers,
        following: followingUsers,
        followEachOtherUsers: followEachOtherUsers,
      };
    }
  }

  async init() {
    const user2 = new User();
    user2.name = 'user2';

    const user3 = new User();
    user3.name = 'user3';

    const user4 = new User();
    user4.name = 'user4';

    const user5 = new User();
    user5.name = 'user5';

    await this.entityManager.save(User, [user2, user3, user4, user5]);

    const user1 = new User();
    user1.name = 'user1';
    user1.followers = [user2, user3];
    user1.following = [user3, user4, user5];

    await this.entityManager.save(User, user1);
  }
}
