import { Body, HttpException, Injectable, Logger } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import * as crypto from 'crypto';
import { InjectRepository } from '@nestjs/typeorm';
import { Login } from './entities/login.entity';
import { Repository } from 'typeorm';

function md5(str: string) {
  return crypto.createHash('md5').update(str).digest('hex');
}

@Injectable()
export class LoginService {
  @InjectRepository(Login)
  private readonly loginRepository: Repository<Login>;

  private logger = new Logger();

  async register(@Body() registerDto: RegisterDto) {
    const { username, password } = registerDto;
    const findUser = await this.loginRepository.findOne({
      where: {
        username,
      },
    });
    if (findUser) {
      throw new HttpException('用户已存在', 400);
    }
    const user = new Login();
    user.username = username;
    user.password = md5(password);

    try {
      await this.loginRepository.save(user);
      return '注册成功';
    } catch (e) {
      this.logger.error(e, LoginService);
      return '注册失败';
    }
  }

  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const findUser = await this.loginRepository.findOne({
      where: {
        username,
      },
    });
    if (!findUser) {
      throw new HttpException('用户不存在', 400);
    }
    if (findUser.password !== md5(password)) {
      throw new HttpException('密码错误', 400);
    }
    return findUser;
  }
}
