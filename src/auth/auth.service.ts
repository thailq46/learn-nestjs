import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {IUser} from 'src/types/user.interface';
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

  async login(user: IUser) {
    const {_id, email, name, role} = user;
    const payload = {
      sub: 'token login',
      iss: 'from server',
      email,
      _id,
      name,
      role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      _id,
      email,
      name,
      role,
    };
  }
}
