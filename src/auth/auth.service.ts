import {BadRequestException, Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtService} from '@nestjs/jwt';
import {Response} from 'express';
import * as ms from 'ms';
import {RolesService} from 'src/roles/roles.service';
import {IUser, USER_ROLE} from 'src/types/user.interface';
import {RegisterUserDto} from 'src/users/dto/create-user.dto';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private roleService: RolesService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      return null;
    }
    const isValid = this.usersService.isValidPassword(password, user.password);
    if (user && isValid) {
      const userRole = user.role as unknown as {_id: string; name: string};
      let role: any = [];
      if (userRole) {
        role = await this.roleService.findOne(userRole._id);
      }
      const objUser = {
        ...user,
        permissions: role?.permissions,
      };
      return objUser;
    }
    return null;
  }

  async login(user: IUser, res: Response) {
    const {_id, email, name, role, permissions} = user;
    const accessToken = await this.createAccessToken(user);
    const refreshToken = await this.createRefreshToken(user);
    await this.usersService.updateUserRefreshToken(user._id, refreshToken);

    const expiresIn = this.configService.get<ms.StringValue>('REFRESH_TOKEN_EXP') || '30d';

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: ms(expiresIn),
    });

    return {
      access_token: accessToken,
      user: {
        _id,
        email,
        name,
        role,
        permissions,
      },
    };
  }

  async register(registerDTO: RegisterUserDto) {
    // Fetch role user
    const userRole = await this.roleService.findRoleByName(USER_ROLE);
    const user = await this.usersService.register({
      ...registerDTO,
      role: userRole?._id as any,
    });
    return {
      _id: user?._id,
      createdAt: user?.createdAt,
    };
  }

  async createAccessToken(user: IUser) {
    const {_id, email, name, role} = user;
    const payload = {
      sub: 'token access',
      iss: 'from server',
      email,
      _id,
      name,
      role,
    };
    return this.jwtService.sign(payload);
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

  async processRefreshToken(refreshToken: string, res: Response) {
    try {
      const user = await this.usersService.findUserByToken(refreshToken);
      if (user) {
        const userId = user._id.toString();
        const accessToken = await this.createAccessToken({
          ...user,
          _id: userId,
          role: user.role as unknown as {_id: string; name: string},
        });
        const refreshToken = await this.createRefreshToken({
          ...user,
          _id: userId,
          role: user.role as unknown as {_id: string; name: string},
        });
        await this.usersService.updateUserRefreshToken(userId, refreshToken);
        const expiresIn = this.configService.get<ms.StringValue>('REFRESH_TOKEN_EXP') || '30d';

        const userRole = user.role as unknown as {_id: string; name: string};
        const role = await this.roleService.findOne(userRole._id);

        res.clearCookie('refreshToken');
        res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          maxAge: ms(expiresIn),
        });

        return {
          access_token: accessToken,
          user: {
            _id: userId,
            email: user.email,
            name: user.name,
            role: user.role,
            permissions: role?.permissions || [],
          },
        };
      } else {
        throw new BadRequestException('Token không hợp lệ');
      }
    } catch (error) {
      throw new BadRequestException('Token không hợp lệ: ' + error);
    }
  }

  async logout(res: Response, user: IUser) {
    await this.usersService.updateUserRefreshToken(user._id, '');
    res.clearCookie('refreshToken');
    return 'Đăng xuất thành công';
  }
}
