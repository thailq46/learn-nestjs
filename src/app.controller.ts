import {Controller, Get} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import {AppService} from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    console.log('GET', this.configService.get<string>('PORT'));
    return this.appService.getHello();
  }
}
