import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async init() {
    await this.userService.init();
    return '初始化完成';
  }

  @Get('follow-relationship')
  async followRelationShip(@Query('id') id: string) {
    if (!id) {
      throw new BadRequestException('userId 不能为空');
    }
    return this.userService.getFollowRelationship(+id);
  }

  @Get('follow')
  async follow(@Query('id1') userId1: string, @Query('id2') userId2: string) {
    await this.userService.follow(+userId1, +userId2);
    return '关注成功';
  }
}
