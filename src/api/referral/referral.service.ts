import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { referralDTO } from './dto/referral.dto';
import { referral } from './entities/referral.entity';
import * as Phonecode from "./../users/utils/phoneCode.json"
import { RegisterType } from '../users/entities';
import { UsersService } from '../users/users.service';
import { TwilioService } from 'nestjs-twilio';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import EmailService from 'src/shared/services/emails.service';
import { EmailDTO } from '../auth/auth.dto';
import { UpdateUserDto } from '../users/dto';
import { invitation } from './dto/invitationDTO';
import { createReferral } from './dto/createReferalDTO';
import { ResponseModel } from 'src/utils/responseModel';

@Injectable()
export class referralService {
  constructor(
    @InjectRepository(referral)
    private referralRepository: Repository<referral>,
    private userService: UsersService,
    private readonly twilioService: TwilioService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,


  ) { }


  async create(referral: createReferral) {
    try {
      let add = await this.referralRepository.create(referral)
      let save = await this.referralRepository.save(add)
      if (save) {
        return {
          status: 1, message: 'referral added', data: save
        }
      }
      else {
        return {
          status: 0, message: 'failed to add referral'
        }
      }
    } catch (error) {
      throw new BadRequestException('error in adding referral' + error.message);
    }
  }




  async sendInvitation(invite: invitation, userId: number): Promise<ResponseModel<createReferral>> {
    let response: ResponseModel<any> = new ResponseModel<any>();
    let countryCode = invite.countryCode ? invite.countryCode : ""
    let number = invite.number ? invite.number : ""
    let type = invite.type
    let email = invite.email ? invite.email : ""
    try {
      let user = await this.userService.findById(userId)
      if (user) {
        let referralData: createReferral = new createReferral()
        let isSecond = false;
        let videoUrl = "";
        let downloadLink = ""
        let SMSBody = [`${user.fullname} has invited you to Gro! watch to learn more`, `Video URL: ${videoUrl}`, `With ${user.fullname}'s referral code, you will receive a week of premium, free!`, `Download link: ${downloadLink}`]
        if (type == RegisterType.PHONE) {
          if (number) {
            const phoneCode = Phonecode[countryCode];
            let phoneNumber = `${phoneCode}${number}`
            if (phoneNumber[0] != '+') {
              phoneNumber = `+${phoneNumber}`
            }
            //#region 
            const checknumber = await this.userService.findByPhone(phoneNumber)
            if (checknumber) {
              response.setErrorWithData(`user already exist with User Name: ${checknumber.username}`, false, {})
              return response
            }
            let checkUserreferal = await this.referralRepository.find({ where: { invitedUserPhoneNo: phoneNumber, userId: user.id } });
            if (checkUserreferal.length > 0) {
              response.setErrorWithData("You only refer you Friend once", false, {})
              return response
            }
            const referal = await this.findByPhone(phoneNumber)
            if (referal) {
              isSecond = true
              referralData.isPremium = false
            }
            //#endregion
            try {
              let results: any[] = await Promise.all(SMSBody.map(async (item): Promise<any> => {
                return await this.sendSMS(item, phoneNumber)
              }));
              if (!results) {
                response.setErrorWithData("error while sending SMS", false, {})
                return response
              }
              referralData.invitedUserPhoneNo = phoneNumber
            } catch (error) {
              response.setErrorWithData("error while sending SMS", false, {})
              return response
            }
          }
          else {
            response.setErrorWithData("number not found", false, {})
            return response
          }
        }
        else if (type === RegisterType.EMAIL) {
          if (email) {
            //#region 
            const checkEmail = await this.userService.findByEmail(email)
            if (checkEmail) {
              response.setErrorWithData(`user already exist with User Name: ${checkEmail.username}`, false, {})
              return response
            }
            let checkUserreferal = await this.referralRepository.find({ where: { invitedUserEmail: email, userId: user.id } });
            if (checkUserreferal.length > 0) {
              response.setErrorWithData("You only refer you Friend once", false, {})
              return response
            }
            const referal = await this.findByEmail(email)
            if (referal) {
              isSecond = true
              referralData.isPremium = false

            }
            let text = `${SMSBody[0]}.<br>${SMSBody[1]}<br>${SMSBody[2]}<br>${SMSBody[3]}`;
            let emailCheck = await this.sendVerificationLink(email, text)
            if (!emailCheck) {
              response.setErrorWithData("error while sending email", false, {})
              return response
            }
            referralData.invitedUserEmail = email
          }
          else {
            response.setErrorWithData("email not found", false, {})
            return response
          }
        }
        else {
          response.setErrorWithData("Invalid Type", false, {})
          return response
        }
        let text = `${SMSBody[0]}.<br>${SMSBody[1]}<br>${SMSBody[2]}<br>${SMSBody[3]}`;
        referralData.messageBody = text
        referralData.userId = userId
        referralData.type = type
        let referral = await this.create(referralData);
        if (referral.status == 1) {
          if (!isSecond) {
            let userData: UpdateUserDto = new UpdateUserDto
            userData = Object.assign(userData, user)
            userData.is_premium_member = new Date().setDate(new Date().getDate() + 7)
            delete userData['dtoClass'];
            let updUser = await this.userService.updateUser(userId, userData)
            if (updUser.affected == 0) {
              response.setErrorWithData("unable to premium_user, email and referral set it DB", false, {})
              return response
            }
            else {
              response.setSuccessAndData(referral.data, "referral added user mark as premium")
              return response
            }
          }
          else {
            response.setSuccessAndData(referral.data, "referral added user NOT mark as premium")
            return response
          }
        }
        else {
          response.setErrorWithData("Error creating referral", false, {})
          return response
        }
      }
      else {
        response.setErrorWithData("user not found", false, {})
        return response
      }
    } catch (error) {
      response.setServerError(error)
    }
  }

  async sendSMS(messageBody, phoneNumber) {
    const message = await this.twilioService.client.messages.create({
      body: messageBody,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  }

  async sendVerificationLink(email: string, message: string): Promise<boolean> {
    let emailSend = await this.emailService.sendMail({
      from: 'Gro <noreply@flexon.io>',
      to: email,
      subject: 'Gro Invitation',
      html: message,
    })
    if (emailSend) {
      return true
    }
    else {
      return false
    }
  }

  findAll() {
    return `This action returns all feedbacks`;
  }
  remove(id: number) {
    return `This action removes a #${id} feedback`;
  }
  async findOne(id: number) {
    const user = await this.referralRepository.findOneBy({ id });
    if (user) return user;
    else return null;
  }

  async findByPhone(invitedUserPhoneNo: string) {
    const user = await this.referralRepository.findOneBy({ invitedUserPhoneNo });
    if (user) return user;
    else return null;
  }

  async findById(id: number) {
    const user = await this.referralRepository.findOneBy({ id });
    if (user) return user;
    return null;
  }
  async findByEmail(invitedUserEmail: string) {
    const user = await this.referralRepository.findOne({ where: { invitedUserEmail } })
    if (!user) {
      return false;
    }
    return user;
  }
}
