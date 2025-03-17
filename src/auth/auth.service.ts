import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Response} from 'express';
import * as ms from 'ms';
import {IUser} from 'src/types/user.interface';
import {RegisterUserDto} from 'src/users/dto/create-user.dto';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }
    const isValid = this.usersService.isValidPassword(password, user.password);
    if (user && isValid) {
      return user;
    }
    return null;
  }

  async login(user: IUser, res: Response) {
    const {_id, email, name, role} = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      email,
      _id,
      name,
      role,
    };
    const refreshToken = await this.createRefreshToken(user);
    await this.usersService.updateUserRefreshToken(user._id, refreshToken);

    const expiresIn = this.configService.get<ms.StringValue>('REFRESH_TOKEN_EXP') || '30d';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: ms(expiresIn),
      sameSite: 'none',
    });

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        _id,
        email,
        name,
        role,
      },
    };
  }

  async register(registerDTO: RegisterUserDto) {
    const user = await this.usersService.register(registerDTO);
    return {
      _id: user?._id,
      createdAt: user?.createdAt,
    };
  }

  async createRefreshToken(user: IUser) {
    const {_id, email, name, role} = user;
    const payload = {
      sub: 'token refresh',
      iss: 'from server',
      email,
      _id,
      name,
      role,
    };
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('REFRESH_TOKEN_EXP'),
    });
    return refreshToken;
  }
}
