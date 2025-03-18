import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {RolesService} from 'src/roles/roles.service';
import {IUser} from 'src/types/user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private configService: ConfigService,
    private roleService: RolesService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('ACCESS_SECRET') || 'default_secret',
    });
  }

  async validate(user: IUser) {
    const {_id, name, email, role} = user;
    // Gán thêm permission vào req.user
    const userRole = await this.roleService.findOne(role._id);
    return {
      _id,
      name,
      email,
      role,
      permissions: userRole?.permissions,
    };
  }
}
