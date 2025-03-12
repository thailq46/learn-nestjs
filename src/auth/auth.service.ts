import {Injectable} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
}
