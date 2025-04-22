import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    UserModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Fan0124.',
      database: 'following',
      synchronize: true, // 根据同步建表，也就是当 database 里没有和 Entity 对应的表的时候，会自动生成建表 sql 语句并执行
      logging: true, // 打印生成的 sql 语句
      entities: [User], // 指定有哪些和数据库的表对应的 Entity
      migrations: [], // 修改表结构之类的 sql
      subscribers: [], // 一些 Entity 生命周期的订阅者，比如 insert、update、remove 前后，可以加入一些逻辑
      poolSize: 10, // 指定数据库连接池中连接的最大数量
      connectorPackage: 'mysql2', // 驱动包
      extra: {
        // 额外发送给驱动包的一些选项
        authPlugin: 'sha256_password',
      },
    }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
