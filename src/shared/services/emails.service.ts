import { Injectable, Logger, RequestTimeoutException } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export default class EmailService {
    private nodemailerTransport: Mail;

    constructor(
        private readonly configService: ConfigService
    ) {
        this.nodemailerTransport = createTransport({
            service: this.configService.get('EMAIL_SERVICE'),
            host: 'smtp.gmail.com', 
            auth: {
                user: this.configService.get('EMAIL_USER'),
                pass: this.configService.get('EMAIL_PASSWORD'),
            }
        });
    }

    async sendMail(options: Mail.Options):Promise<boolean> {
        try {
            const result = await this.nodemailerTransport.sendMail(options);
            if(result){
                return true
            }
            else{
                return false;
            }
             
        } catch (error) {
            Logger.log(error+"sending email");
            throw new RequestTimeoutException('Request timed out');
        }
    }
}