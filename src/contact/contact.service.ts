import { Injectable } from '@nestjs/common';
import { ContactDto } from './dto/contact.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class ContactService {
  constructor(private readonly mailService: MailService) {}

  async sendMessage(contactDto: ContactDto) {
    await this.mailService.sendContactEmail(contactDto);

    return {
      success: true,
      message: 'Message sent successfully',
    };
  }
}
