import {MailerService} from '@nestjs-modules/mailer';
import {Controller, Get} from '@nestjs/common';
import {Public, ResponseMessage} from 'src/decorator/customize';
import {MailService} from './mail.service';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private readonly mailerService: MailerService,
  ) {}

  @Public()
  @Get()
  @ResponseMessage('Mail sent')
  async handleTestEmail() {
    await this.mailerService
      .sendMail({
        to: 'thai.lq011002@gmail.com', // list of receivers
        from: 'noreply@nestjs.com', // sender address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        template: 'test',
      })
      .then(() => {})
      .catch(() => {});
  }
}
