import {Module} from '@nestjs/common';
import {PassportModule} from '@nestjs/passport';
import {LocalStrategy} from 'src/auth/passport/local.strategy';
import {UsersModule} from 'src/users/users.module';
import {AuthService} from './auth.service';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
