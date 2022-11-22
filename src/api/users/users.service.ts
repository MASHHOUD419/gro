import {
  Injectable,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
  Inject,
  forwardRef,
  Logger
} from '@nestjs/common';
import { startOfMonth, endOfMonth, getMonth, isYesterday } from 'date-fns';
import { validate } from "class-validator"
import { TwilioService } from 'nestjs-twilio';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterType, User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { ValidateEmail } from 'src/utils/utils';
import { EmailDTO, LoginType, ResetPasswordDto, UserLoginDto } from '../auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import EmailService from 'src/shared/services/emails.service';
import { TasksService } from '../tasks/tasks.service';
import { FileService } from 'src/shared/services/file.service';
import { S3BucketFolderType } from 'src/shared/types';
import { Streak } from './entities';
import { generateUserNameAndPass } from './dto/generateUserNamePass.dto';
// import { EmailConfirmationService } from '../email-confirmation/email-confirmation.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Streak)
    private streakRepository: Repository<Streak>,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly jwtService: JwtService,
    private readonly twilioService: TwilioService,
    @Inject(forwardRef(() => TasksService)) private readonly taskService: TasksService,
    private readonly fileService: FileService
  ) { }

  async create(createUserDto: CreateUserDto) {
    if (createUserDto.email && createUserDto.password) {
      const { email, password } = createUserDto;
      const validationResult = ValidateEmail(email);
      if (!validationResult) {
        throw new BadRequestException('Email format is incorrect');
      }
      const exist = await this.usersRepository.findOne({ where: { email } });
      let userAlreadyExists = exist !== null
      if (userAlreadyExists) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }

      // const errors = await validate(createUserDto);
      // if (errors.length > 0) {
      //   throw new BadRequestException(`Validation failed!`);
      // }
      const salt = await bcrypt.genSalt()
      const passwordHash = await bcrypt.hash(password, salt)
      createUserDto.password = passwordHash
    } else if (createUserDto.phone_number) {
      const { phone_number } = createUserDto;
      const exist = await this.usersRepository.findOne({ where: { phone_number } });
      let userAlreadyExists = exist !== null
      if (userAlreadyExists) {
        throw new HttpException("User already exists", HttpStatus.BAD_REQUEST);
      }
    }
    Logger.log(createUserDto);
    const user = this.usersRepository.create(createUserDto);
    
    const _user = await this.usersRepository.save(user);
    return _user;

  }

  async createSave(createUserDto:CreateUserDto):Promise<User>{
    const user = this.usersRepository.create(createUserDto);
    const _user = await this.usersRepository.save(user);
    return _user;
  }

  async findAll() {
    return `This action returns all users`;
  }

  /**
   * 
   * @param id : userId
   * @returns : user | null
   */
  async findOne(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return user;
    else return null;
  }

  async findByPhone(phone_number: string) {
    const user = await this.usersRepository.findOneBy({ phone_number });
    if (user) return user;
    else return null;
  }

  async findById(id: number) {
    const user = await this.usersRepository.findOneBy({ id });
    if (user) return user;
    return null;
  }

  async findByEmailOrUsername(email: string) {
    const criteria = ValidateEmail(email) ? { email } : { username: email };

    const user = await this.usersRepository.findOne({ where: criteria })
    if (!user) {
      return false;
    }
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } })
    if (!user) {
      return false;
    }
    return user;
  }

  async findByUsername(username: string) {
    const user = await this.usersRepository.findOne({ where: { username } })
    if (!user) {
      return false;
    }
    return user;
  }

  async saveUserInfo(user: User) {
    return this.usersRepository.save(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto, file: Express.Multer.File = null) {
    const user = await this.findById(id);
    if (!user) throw new BadRequestException('User not found');
    if (file) {
      const result = await this.fileService.uploadPublicFile(
        file.buffer,
        file.originalname,
        file.mimetype,
        S3BucketFolderType.AVATAR
      );
      updateUserDto.photo = result.url;
    }

    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    const user = await this.findById(id);
    return this.usersRepository.remove(user);
  }
 async updateUser(id:number,updateUserDto:UpdateUserDto){
  return this.usersRepository.update(id, updateUserDto);
 }
  async userProfile(id: number) {
    const user = await this.findById(id);

    const taskData = await this.taskService.getUserAllTimeStatistics(id);

    return {
      ...user.toDto(),
      task: taskData
    }
  }
  /**
   * 
   * @param email : Email address
   * @param name 
   * @param type 
   * @returns 
   */

  async createWithSocial(email: string, name: string, type: LoginType) {

    const newUser = this.usersRepository.create({email,
      fullname: name,
      username: email,
      register_type: type,
    });
    await this.usersRepository.save(newUser);
    return newUser;
  }

  async setRefreshToken(refreshToken: string, id: number) {
    const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    const user = await this.usersRepository.update(id, {
      refresh_token: hashedRefreshToken
    });
    return user;
  }

  async setUserVerified(user: User) {
    return this.usersRepository.save(user);
  }

  async sendVerificationLink(email: string, code: number, type = 'email'):Promise<boolean> {
    const payload: EmailDTO = { email };
    const token = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
      expiresIn: `${this.configService.get('JWT_VERIFICATION_TOKEN_EXPIRATION_TIME')}s`
    });

    const _host = this.configService.get('EMAIL_RESET_PASSWORD_URL');
    const url = `${_host}?token=${token}`;
    Logger.log(url);
    let text = `Reset your password.<br> Your code is <br> <string>${code}</strong>`;

    if (type === 'email') {
      text = `Gro verification code: <br> <string>${code}</strong>`;

    }
    let emailSend = await this.emailService.sendMail({
      from: 'Gro <noreply@flexon.io>',
      to: email,
      subject: 'Gro verification code',
      html: text,
    })
    if (emailSend) {
      return true
    }
    else {
      return false
    }
  }

  async resetUserPassword(resetPasswordDto: ResetPasswordDto, userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    // const isMatch = await bcrypt.compare(resetPasswordDto.current_password, user.password);
    // if (!isMatch) {
    //   throw new BadRequestException('The current password is invalid');
    // } else
    //  if (resetPasswordDto.new_password !== resetPasswordDto.confirm_password) {
    //   throw new BadRequestException('Passwords not matched');
    // }
    if (resetPasswordDto.code !== user.reset_pwd_code) {
      throw new BadRequestException('Code not matched');
    }
    if (resetPasswordDto.new_password.length < 6) {
      throw new BadRequestException('Password length must be than 6 digits');
    }
    user.password = resetPasswordDto.new_password;

    return this.usersRepository.save(user);

  }

  

  async logout(userId: number) {
    const user = await this.usersRepository.update(userId, {
      refresh_token: null
    });
    return user;
  }

  async getUserStreak(userId: number) {
    const user = await this.findById(userId);
    if (!user) throw new BadRequestException('User not found');

    return {
      status: 1,
      data: {
        streak: user.streaks
      },
      message: 'current user streak'
    };
  }

  async getLongestStreak(userId: number) {
    const query = this.streakRepository.createQueryBuilder("streak");
    query
      .select("MAX(streak.last_value)", "longest_streak")
      .where('user_id = :userId', { userId });
    const result = await query.getRawOne();
    return {
      status: 1,
      data: {
        streak: result.longest_streak ? result.longest_streak : 0
      },
      message: 'longest user streak'
    };
  }

  async getMonthlyLongestStreak(userId: number) {
    const now = new Date();
    const query = this.streakRepository.createQueryBuilder("streak");
    query
      .select("MAX(streak.last_value)", "longest_streak")
      .where('streak.user_id = :userId', { userId })
      .andWhere('streak.last_completion_date >= :after', { after: startOfMonth(now) })
      .andWhere('streak.last_completion_date <= :before', { before: endOfMonth(now) });
    const result = await query.getRawOne();
    return {
      status: 1,
      data: {
        streak: result.longest_streak ? result.longest_streak : 0
      },
      message: 'longest user streak'
    };
  }

  async socialLogins(createUser: CreateUserDto) {
    try {
      const user = this.usersRepository.create(createUser);
      const _user = await this.usersRepository.save(user);
      return _user

    } catch (error) {
      throw new BadRequestException('error while storing user data in DB' + error.message);
    }
  }
  async generatePassword() {
    let length = 10,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789()@#$%*!|?",
      retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(retVal, salt)
    return {passwordHash,retVal};
  }
  async generateUserNamePass(userData: generateUserNameAndPass) {
    try {
      let userName: string = null;
      const userCheck: any = await this.findById(+userData.userId)
      delete userCheck['dtoClass'];

      let exist = new UpdateUserDto()
      exist = Object.assign(exist, userCheck)

      if (exist) {
        if (userData.register_type == RegisterType.EMAIL) {
          userName = exist.email.split("@")[0];
          userName = userName.replace(/[^a-zA-Z]/g, "")
          const nameExist = await this.findByUsername(userName)
          if (!nameExist) {
            let {passwordHash,retVal}= await this.generatePassword()
            exist.password = passwordHash
            exist.username = userName
            let upduserName = await this.usersRepository.update(+userData.userId, exist);
            if (upduserName) {
              return {
                userId: userData.userId,
                userName: exist.username,
                retVal
              }
            }
            else {
              throw new BadRequestException('unable to username user in DB');

            }
          }
          else {
            return await this.checkUserName(userName, exist, userData.register_type, userData.userId)
          }

        }
        else {
          if (!exist.fullname || exist.fullname == "") {
            throw new BadRequestException('unable to found user fullName');

          }
          userName = exist.fullname.split(" ")[0];
          userName = userName.replace(/[^a-zA-Z0-9]/g, "")
          const nameExist = await this.findByUsername(userName)
          if (!nameExist) {
            let {passwordHash,retVal}= await this.generatePassword()
            exist.password = passwordHash
            exist.username = userName
            let upduserName = this.usersRepository.update(userData.userId, exist);
            if (upduserName) {
              return {
                userId: userData.userId,
                userName: exist.username,
                retVal
              }
            }
            else {
              throw new BadRequestException('unable to username user in DB');
            }
          }
          else {
            return await this.checkUserName(userName, exist, userData.register_type, userData.userId)
          }

        }
      }
      else {
        throw new BadRequestException('unable to found user in DB');

      }

    } catch (error) {
      throw new BadRequestException('error while storing user data in DB' + error.message);
    }

  }

  async checkUserName(userName: string, exist: UpdateUserDto, registerType: string, userId: string) {
    try {
      let checkName: boolean = true
      let i: number = 1
      while (checkName) {
        let newUserName = userName + i;
        const nameExist = await this.findByUsername(newUserName)
        let pass="";
        if (!nameExist) {
          if (registerType != RegisterType.EMAIL) {
            let {passwordHash,retVal} = await this.generatePassword()
            pass=retVal
            exist.password = passwordHash
          }
          exist.username = newUserName
          let upduserName = await this.usersRepository.update(userId, exist);
          if (upduserName) {
            return {
              userId: userId,
              userName: exist.username,
              retVal:pass
            }
          }
          checkName = false;
        }
        else {
          i++
        }
      }
    } catch (error) {

    }
  }
}
