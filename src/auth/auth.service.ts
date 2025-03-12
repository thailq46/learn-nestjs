import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

  async login(user: any) {
    const payload = {email: user.email, sub: user._id};
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
