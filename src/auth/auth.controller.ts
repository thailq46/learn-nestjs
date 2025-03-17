import {Body, Controller, Post, Request, UseGuards} from '@nestjs/common';
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
  handleLogin(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Đăng ký tài khoản thành công')
  handleRegister(@Body() registerDTO: RegisterUserDto) {
    return this.authService.register(registerDTO);
  }
}
