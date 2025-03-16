import {ValidationPipe} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {NestFactory, Reflector} from '@nestjs/core';
import {NestExpressApplication} from '@nestjs/platform-express';
import {join} from 'path';
import {TransformInterceptor} from 'src/core/transform.interceptor';
import {AppModule} from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useStaticAssets(join(__dirname, '..', 'public')); // js, css, images
  app.setBaseViewsDir(join(__dirname, '..', 'views')); // html
  app.setViewEngine('ejs');

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(configService.get<string>('PORT') ?? 3000);
}
void bootstrap();
