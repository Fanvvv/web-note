import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';

@Controller({
  path: 'user',
  version: '2',
})
export class UserV2Controller {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll2() {
    return this.userService.findAll2();
  }
}
