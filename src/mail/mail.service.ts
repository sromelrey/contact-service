import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ContactDto } from '../contact/dto/contact.dto';
import { Resend } from 'resend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private readonly resend: Resend;
  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('RESEND_API_KEY');

    if (!apiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }
    this.resend = new Resend(apiKey);
  }

  async sendContactEmail(contactDto: ContactDto): Promise<void> {
    const contactEmail = this.configService.get<string>('CONTACT_EMAIL');

    const mailFrom = this.configService.get<string>('MAIL_FROM');

    if (!contactEmail || !mailFrom) {
      throw new Error('Email configuration is incomplete');
    }
    const { data, error } = await this.resend.emails.send({
      from: mailFrom,
      to: [contactEmail],
      replyTo: contactDto.email,
      subject: `Portfolio Contact: ${contactDto.name}`,
      html: `
        <h2>New Portfolio Contact</h2>

        <p>
          <strong>Name:</strong>
          ${contactDto.name}
        </p>

        <p>
          <strong>Email:</strong>
          ${contactDto.email}
        </p>

        <hr />

        <p><strong>Message:</strong></p>

        <p>${contactDto.message}</p>
      `,
    });

    if (error) {
      console.error(`Resend error:`, error);

      throw new InternalServerErrorException('Unable to send message.');
    }
    console.log('Email send Successfuly:', data?.id);
  }
}
