import {Module} from '@nestjs/common';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {MongooseModule} from '@nestjs/mongoose';
import {softDeletePlugin} from 'soft-delete-plugin-mongoose';
import {JwtAuthGuard} from 'src/auth/jwt-auth.guard';
import {AppService} from './app.service';
import {AuthModule} from './auth/auth.module';
import {CompaniesModule} from './companies/companies.module';
import {FilesModule} from './files/files.module';
import {JobsModule} from './jobs/jobs.module';
import {ResumesModule} from './resumes/resumes.module';
import {UsersModule} from './users/users.module';

const GlobalModule = [UsersModule, AuthModule, CompaniesModule, JobsModule, FilesModule, ResumesModule];

@Module({
  imports: [
    // Để lấy URI từ file .env, ta cần sử dụng ConfigModule và ConfigService
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGOOSE_URI'),
        dbName: configService.get<string>('MONGOOSE_DB_NAME'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...GlobalModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
