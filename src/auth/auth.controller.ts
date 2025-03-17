import {Body, Controller, Post, Request, Response as Res, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from 'src/auth/auth.service';
import {LocalAuthGuard} from 'src/auth/local-auth.guard';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {RegisterUserDto} from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  handleLogin(@Request() req, @Res({passthrough: true}) res: Response) {
    return this.authService.login(req.user, res);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Đăng ký tài khoản thành công')
  handleRegister(@Body() registerDTO: RegisterUserDto) {
    return this.authService.register(registerDTO);
  }
}
