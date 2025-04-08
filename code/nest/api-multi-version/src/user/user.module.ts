import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserV2Controller } from './user-v2.controller';

@Module({
  controllers: [UserV2Controller, UserController],
  providers: [UserService],
})
export class UserModule {}
