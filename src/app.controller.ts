import {Controller, Get, Post, Request, UseGuards} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AuthService} from 'src/auth/auth.service';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import {LocalAuthGuard} from 'src/auth/local-auth.guard';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
