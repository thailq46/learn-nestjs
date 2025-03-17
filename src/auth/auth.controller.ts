import {Body, Controller, Get, Post, Req, Request, Response as Res, UseGuards} from '@nestjs/common';
import {Response} from 'express';
import {AuthService} from 'src/auth/auth.service';
import {LocalAuthGuard} from 'src/auth/local-auth.guard';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {IUser} from 'src/types/user.interface';
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

  @Get('/account')
  @ResponseMessage('Lấy thông tin tài khoản thành công')
  handleGetAccount(@User() user: IUser) {
    return {user};
  }

  @Public()
  @Get('/refresh-token')
  @ResponseMessage('Lấy token mới thành công')
  handleRefreshToken(@Req() req, @Res({passthrough: true}) res: Response) {
    const refreskToken = req.cookies['refreshToken'];
    return this.authService.processRefreshToken(refreskToken, res);
  }

  @Post('/logout')
  @ResponseMessage('Đăng xuất thành công')
  handleLogout(@Res({passthrough: true}) res: Response, @User() user: IUser) {
    return this.authService.logout(res, user);
  }
}
