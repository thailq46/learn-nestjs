import {Module} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {JwtModule} from '@nestjs/jwt';
import {PassportModule} from '@nestjs/passport';
import {AuthController} from 'src/auth/auth.controller';
import {JwtStrategy} from 'src/auth/passport/jwt.strategy';
import {LocalStrategy} from 'src/auth/passport/local.strategy';
import {RolesModule} from 'src/roles/roles.module';
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
    RolesModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
