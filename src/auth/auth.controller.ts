import {Body, Controller, Get, Post, Req, Request, Response as Res, UseGuards} from '@nestjs/common';
import {ApiBody} from '@nestjs/swagger';
import {ThrottlerGuard} from '@nestjs/throttler';
import {Response} from 'express';
import {AuthService} from 'src/auth/auth.service';
import {LocalAuthGuard} from 'src/auth/local-auth.guard';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {User} from 'src/decorator/user.decorator';
import {RolesService} from 'src/roles/roles.service';
import {IUser} from 'src/types/user.interface';
import {RegisterUserDto, UserLoginDto} from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly roleService: RolesService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @UseGuards(ThrottlerGuard)
  @ApiBody({type: UserLoginDto})
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
  async handleGetAccount(@User() user: IUser) {
    const temp = (await this.roleService.findOne(user.role._id)) as any;
    user.permissions = temp?.permissions || [];
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
