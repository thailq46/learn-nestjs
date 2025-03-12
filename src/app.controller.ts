import {Controller, Post, Request, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {LocalAuthGuard} from 'src/auth/local-auth.guard';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    return {
      message: 'Login success',
      user: req.user,
    };
  }
}
