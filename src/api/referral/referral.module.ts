import { Module } from '@nestjs/common';
import { referralService } from './referral.service';
import { referralController } from './referral.controller';
import { referral } from './entities/referral.entity';
import { getModelToken } from "@nestjs/sequelize";
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { SharedModule } from 'src/shared/shared.module';
import { TasksModule } from '../tasks/tasks.module';
import { TwilioModule } from 'nestjs-twilio';
import { UsersModule } from '../users/users.module';
import EmailService from 'src/shared/services/emails.service';
@Module({
  imports:[TypeOrmModule.forFeature([referral]),JwtModule.register({}),
  TwilioModule.forRoot({
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
  }), UsersModule,SharedModule],
  controllers: [referralController],
  providers: [referralService]
  

})
export class referralModule {}
