import {Controller, Post, Body, Inject, Res, ValidationPipe} from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';

@Controller('login')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Inject(JwtService)
  private jwtService: JwtService;

  @Post('register')
  register(@Body(ValidationPipe) registerDto: RegisterDto) {
    return this.loginService.register(registerDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.loginService.login(loginDto);
    if (user) {
      const token = await this.jwtService.signAsync({
        user: {
          id: user.id,
          username: user.username,
        },
      });
      res.setHeader('Authorization', `Bearer ${token}`);
      return '登录成功';
    } else {
      return '登录失败';
    }
  }
}
