import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {LocalStrategy} from 'src/auth/passport/local.strategy';
import {UsersModule} from 'src/users/users.module';
import {AuthService} from './auth.service';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('ACCESS_SECRET'),
        signOptions: {expiresIn: config.get<string>('ACCESS_TOKEN_EXP')},
      }),
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
