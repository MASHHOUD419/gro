import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TwilioService } from 'nestjs-twilio';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../users/dto';
import { ValidateEmail, randomCode } from 'src/utils';
import { RegisterType, User } from '../users/entities';
import { ForgotPasswordDTO, LoginType, ResetPasswordDto, SendLoginCodeDto, UserLoginDto, UsernameDto } from './auth.dto';
import { FileService } from 'src/shared/services/file.service';
import { type } from 'os';
import { TemporaryCredentials } from 'aws-sdk';
import { ResponseModel } from 'src/utils/responseModel';

let verifyCode = {
    auth: {
        sms: "Gro verification code: @code",
        reset_password: 'Gro reset password code: @code',
    },
};

export enum SMSType {
    VERIFY_REGISTER = 'sms',
    VERIFY_RESET_PASSWORD = 'reset_password'
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private readonly twilioService: TwilioService,
        private readonly fileService: FileService
        // @InjectModel('User') private userModel: Model<User>
    ) { }


   

    async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
        if (!createUserDto.email && !createUserDto.phone_number) {
            throw new BadRequestException('Either Email or phone number is required.')
        }
        if (createUserDto.email && createUserDto.phone_number) {
            throw new BadRequestException('One of Email and phone number is allowed.')
        }
        if (createUserDto.phone_number) {
            const { message, code } = await this.sendSMS(createUserDto.phone_number, SMSType.VERIFY_REGISTER);
            if (message.errorCode) {
                throw new BadRequestException(message.errorMessage);
            }
            createUserDto.verify_code = code;
        } else if (createUserDto.email) {
            const code = parseInt(randomCode(5, "123456789"));
            await this.usersService.sendVerificationLink(createUserDto.email, code, 'email');
            createUserDto.verify_code = code;
        } else {
            throw new BadRequestException('Something wrong');
        }
        if (file) {
            const result = await this.fileService.uploadPublicFile(
                file.buffer,
                file.originalname,
                file.mimetype
            );
            createUserDto.photo = result.url;
        }

        return this.usersService.create(createUserDto)
    }
    async fileuploading(file: Express.Multer.File): Promise<string | boolean> {
        if (file) {
            const result = await this.fileService.uploadPublicFile(
                file.buffer,
                file.originalname,
                file.mimetype
            );
            if (result.url) {
                return result.url
            }
            else {
                return false;
            }
        }
    }

    async createSaoud(createUserDto: CreateUserDto, file: Express.Multer.File): Promise < ResponseModel < any >> {
        let response: ResponseModel<any> = new ResponseModel<any>();
        try {
            //#region 
            if(createUserDto.email) {
        let email = await this.usersService.findByEmail(createUserDto.email)
        if (email) {
            response.setErrorWithData("Email Already exist", false, {})
            return response; 
        }
    }
    if (createUserDto.phone_number) {
        let phone = await this.usersService.findByPhone(createUserDto.phone_number)
        if (phone) {
            response.setErrorWithData("phone number Already exist", false, {})
            return response; 
        }
    }
    if (createUserDto.username) {
        let phone = await this.usersService.findByUsername(createUserDto.username)
        if (phone) {
            response.setErrorWithData("userName Already exist", false, {})
            return response; 
        }
    }
    //#endregion
    if (createUserDto.register_type === LoginType.EMAILPASSCODE) {
        if (createUserDto.fullname && createUserDto.email) {
            let fileURL: any = ""
            if (file) {
                let fileURL = await this.fileuploading(file)
                if (fileURL == false) {
                    response.setErrorWithData("Error in file uploading", false, {})
                    return response; 
                }
            }
            const code = parseInt(randomCode(5, "123456789"));
            createUserDto.photo = fileURL
            createUserDto.verify_code = code
            createUserDto.verified = false;
            const user = await this.usersService.createSave(createUserDto)
            let userId = user.id.toString();
            if (!userId) {
                response.setErrorWithData("user not created", false, {})
                return response; 
            }
            const generateuserName = await this.usersService.generateUserNamePass({ register_type: RegisterType.EMAIL, userId })
            if (!generateuserName.retVal || generateuserName.retVal == "") {
                response.setErrorWithData("username generated", false, {})
                return response;
            }
            let varificatioLink = await this.usersService.sendVerificationLink(createUserDto.email, code, 'email');
            if (!varificatioLink) {
                response.setErrorWithData("send varification code again but user created", false, {})
                return response;
            }
            user.username=generateuserName.userName
            response.setSuccessAndData(user,"user created code sends")
            return response
        }
        else {
            response.setErrorWithData("Either Email or FullName is missing", false, {})
            return response; 
        }
    }
    else if (createUserDto.register_type === LoginType.PHONEPASSCODE) {
        if (createUserDto.fullname && createUserDto.phone_number) {
            let fileURL: any = ""
            if (file) {
                let fileURL = await this.fileuploading(file)
                if (fileURL == false) {
                    response.setErrorWithData("Error in file uploading", false, {})
                    return response; 
                }
            }
            const codeGenerate = parseInt(randomCode(5, "123456789"));
            createUserDto.photo = fileURL
            createUserDto.verify_code = codeGenerate
            createUserDto.verified = false;
            const user = await this.usersService.createSave(createUserDto)
            let userId = user.id.toString();
            if (!userId) {
                response.setErrorWithData("user not created", false, {})
                return response; 
            }
            const generateuserName = await this.usersService.generateUserNamePass({ register_type: RegisterType.EMAIL, userId })
            if (!generateuserName.retVal || generateuserName.retVal == "") {
                response.setErrorWithData("username generated", false, {})
                return response; 
            }
            const { message, code } = await this.sendSMSOnCreate(createUserDto.phone_number, SMSType.VERIFY_REGISTER, codeGenerate);
            if (message.errorCode) {
                response.setErrorWithData(message.errorMessage, false, {})
                return response; 
            }
            else{
                user.username=generateuserName.userName
                response.setSuccessAndData(user,"referal code sends")
                return response
            }
           
        }
        else {
            response.setErrorWithData("Invalid login Type", false, {})
            return response; 
        }
    }
    else {
        response.setErrorWithData("Invalid login Type", false, {})
        return response;
    }
        } catch (error) {
            response.setServerError(error)

    }
    }

    async loginSaoud(userLoginDto: UserLoginDto): Promise<ResponseModel<any>> {
        let response: ResponseModel<any> = new ResponseModel<any>();
        try {
            if (userLoginDto.type === LoginType.PHONEPASSCODE) {
                if (userLoginDto.phone_number && +userLoginDto.code) {
                    let user: User = await this.usersService.findByPhone(userLoginDto.phone_number);
                    if (user) {
                        if (user.verify_code) {
                            if (user.verify_code === +userLoginDto.code) {
                                let tokens = await this.generateAccessToken(userLoginDto.phone_number, user.id)
                                const { password, ...userData } = user;
                                response.setSuccessAndData({ ...tokens, userData }, "user found")
                                return response
                            }
                            else {
                                response.setErrorWithData('Invalid Passcode ', false, {})
                                return response;
                            }
                        }
                        else {
                            response.setErrorWithData('verify code not found', false, {})
                            return response;
                        }
                    }
                    else {
                        response.setErrorWithData('user not found', false, {})
                        return response;
                    }
                }
                else {
                    response.setErrorWithData('either Passcode or phoneNumber missing ', false, {})
                    return response;
                }
            }
            else if (userLoginDto.type === LoginType.PHONEPASSWORD) {
                if (userLoginDto.phone_number && userLoginDto.password) {
                    let user: User = await this.usersService.findByPhone(userLoginDto.phone_number);
                    if (user) {
                        if (user.password) {
                            const isMatch = await bcrypt.compare(userLoginDto.password, user.password);
                            if (isMatch) {
                                let tokens = await this.generateAccessToken(userLoginDto.phone_number, user.id)
                                const { password, ...userData } = user;
                                response.setSuccessAndData({ ...tokens, userData }, "user login")
                                return response;
                            }
                            else {
                                response.setErrorWithData('Invalid password', false, {})
                                return response;
                            }
                        }
                        else {
                            response.setErrorWithData('Password Not Found against userId in DB', false, {})
                            return response;
                        }
                    }
                    else {
                        response.setErrorWithData('invalid PhoneNumber', false, {})
                        return response;
                    }
                }
                else {
                    response.setErrorWithData('either Password or phoneNumber missing', false, {})
                    return response;
                }
            }
            else if (userLoginDto.type === LoginType.EMAILPASSWORD) {
                if (userLoginDto.email && userLoginDto.password) {
                    let user: User | boolean = await this.usersService.findByEmailOrUsername(userLoginDto.email);
                    if (user) {
                        if (user.password) {
                            const isMatch = await bcrypt.compare(userLoginDto.password, user.password);
                            if (isMatch) {
                                let tokens = await this.generateAccessToken(userLoginDto.email, user.id)
                                const { password, ...userData } = user;
                                response.setSuccessAndData({ ...tokens, userData }, 'either Passcode or phoneNumber missing')
                                return response
                            }
                            else {
                                response.setErrorWithData('Invalid password ', false, {})
                                return response;
                            }
                        }
                        else {
                            response.setErrorWithData('Password Not Found against userId in DB ', false, {})
                            return response;
                        }
                    }
                    else {
                        response.setErrorWithData('email not exist ', false, {})
                        return response;
                    }
                }
                else {
                    response.setErrorWithData('either Password or email missing ', false, {})
                    return response;
                }
            }
            else {
                response.setErrorWithData('either Passcode or phoneNumber missing ', false, {})
                return response;
            }
        } catch (error) {
            response.setServerError(error)
            return response
        }


    }
    async generateAccessToken(emailPhone: string, userId: number) {
        let payload = { email: emailPhone, sub: userId };
        const { accessToken, refreshToken } = await this.getTokens(payload);
        Logger.log({ accessToken, refreshToken });
        await this.usersService.setRefreshToken(refreshToken, payload.sub);
        return {
            access_token: accessToken,
            status: 1,
            refresh_token: refreshToken,
            token_type: "Bearer",
            expires_in: process.env.JWT_EXPIRATION_TIME,
        };
    }

    async login(userLoginDto: UserLoginDto) {
        let payload = { email: '', sub: 0 };
        let user = null;
        if (userLoginDto.phone_number) {
            user = await this.usersService.findByPhone(userLoginDto.phone_number);
            if (!user) throw new BadRequestException('Login failed');
            if (user.verify_code !== userLoginDto.code)
                throw new BadRequestException('Invalid verfication code');

            payload = { email: userLoginDto.phone_number, sub: user.id };
        } else {
            user = await this.validateUser(userLoginDto.email, userLoginDto.password);
            if (!user) throw new BadRequestException('Login failed');
            payload = { email: userLoginDto.email, sub: user.id };
        }

        const { accessToken, refreshToken } = await this.getTokens(payload);
        Logger.log({ accessToken, refreshToken });
        await this.usersService.setRefreshToken(refreshToken, payload.sub);
        return {
            access_token: accessToken,
            status: 1,
            refresh_token: refreshToken,
            token_type: "Bearer",
            expires_in: process.env.JWT_EXPIRATION_TIME,
            user
        };
    }
    async socialMediaLogin(socialLoginDto: CreateUserDto) {
        let payload = { email: '', sub: 0 };
        let user = null;
        if (socialLoginDto.phone_number) {
            user = await this.usersService.findByPhone(socialLoginDto.phone_number);
            if (user) throw new BadRequestException('phone number already exist');
        }
        if (socialLoginDto.email) {
            user = await this.usersService.findByEmail(socialLoginDto.email);
            if (user) throw new BadRequestException('email already exist');
        }
        const userData = await this.usersService.socialLogins(socialLoginDto)
        if (userData) {
            payload = { email: userData.email, sub: userData.id };
            const { accessToken, refreshToken } = await this.getTokens(payload);
            Logger.log({ accessToken, refreshToken });
            await this.usersService.setRefreshToken(refreshToken, payload.sub);
            return {
                access_token: accessToken,
                status: 1,
                refresh_token: refreshToken,
                token_type: "Bearer",
                expires_in: process.env.JWT_EXPIRATION_TIME,
                user
            };
        }


    }
    async authenticateApple(token: string) {
        Logger.log(token);
    }

    async getTokens(payload: any) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                payload,
                {
                    secret: process.env.JWT_SECRET_KEY,
                    expiresIn: process.env.JWT_EXPIRATION_TIME
                },
            ),
            this.jwtService.signAsync(
                payload,
                {
                    secret: process.env.JWT_REFRESH_TOKEN_PRIVATE_KEY,
                    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.usersService.findById(userId);
        if (!user || !user.refresh_token)
            throw new ForbiddenException('Access Denied');
        Logger.log(refreshToken);

        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refresh_token
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');

        const tokens = await this.getTokens({ email: user.email, sub: user.id });
        await this.usersService.setRefreshToken(tokens.refreshToken, user.id);
        return { ...tokens, status: 1 };
    }

    async checkEmail(email: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new BadRequestException('User not found');
        if (user.verified) {
            return { status: 1, msg: 'Verified.' }
        }
        return { status: 0, msg: 'Not verified.' }
    }

    async validateUser(email: string, _password: string): Promise<any> {
        const user = await this.usersService.findByEmailOrUsername(email);
        if (!user) throw new NotFoundException('User Not found');
        Logger.log(user)
        // if (!user.phoneVerified) throw new BadRequestException('Your email address has not been verified');
        const isMatch = await bcrypt.compare(_password, user.password);
        if (!isMatch) {
            throw new BadRequestException('Password not matched');
        }

        const { password, ...result } = user;

        return result;
    }

    async sendSMS(phoneNumber: string, smsType: SMSType) {
        const code = parseInt(randomCode(5, "123456789"));
        const sms = verifyCode.auth[smsType].replace("@code", String(code));
        const message = await this.twilioService.client.messages.create({
            body: sms,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
        return { message, code };
    }

    async sendSMSOnCreate(phoneNumber: string, smsType: SMSType, code: number) {
        const sms = verifyCode.auth[smsType].replace("@code", String(code));
        const message = await this.twilioService.client.messages.create({
            body: sms,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        });
        return { message, code };
    }

    async verifyCode(code: number, userId: number) {
        const user = await this.usersService.findById(userId);
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.verify_code !== code) {
            return { status: 0, message: 'Your verification failed.' };
        }
        user.verified = true;
        await this.usersService.setUserVerified(user);
        return { status: 1, message: 'Your verification succeed.' }
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDTO) {
        if (!forgotPasswordDto.email) {
            throw new BadRequestException('Email is required');
        }

        const user = await this.usersService.findByEmail(forgotPasswordDto.email);
        if (!user) {
            throw new BadRequestException('User not found');
        }
        const code = parseInt(randomCode(5, "123456789"));
        await this.usersService.sendVerificationLink(forgotPasswordDto.email, code);
        user.reset_pwd_code = code;
        await this.usersService.setUserVerified(user);

        return { status: 1, message: 'Reset link or code has been sent' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto, userId: number) {
        const user = await this.usersService.resetUserPassword(resetPasswordDto, userId);
        if (!user) {
            return { status: 0, message: 'Something is wrong' };

        }
        return { status: 1, message: 'success' };
    }

    async validateUsername(usernameDto: string) {
        const user = await this.usersService.findByUsername(usernameDto);
        if (!user) {
            return { status: 1, message: 'Username is available' };
        }

        return { status: 0, message: 'Not available' };
    }

    async sendLoginCode(loginCodeDto: SendLoginCodeDto) {
        const user = await this.usersService.findByPhone(loginCodeDto.phone_number);
        if (!user) {
            return { status: 0, message: 'user not found' };
        }

        const { message, code } = await this.sendSMS(loginCodeDto.phone_number, SMSType.VERIFY_REGISTER);

        if (message.errorCode) {
            throw new BadRequestException(message.errorMessage);
        }
        user.verify_code = code;
        await this.usersService.setUserVerified(user);
        return { status: 1, message: 'check your phone', user_id: user.id };
    }

    async logout(userId: string) {
        return this.usersService.logout(+userId);
    }

}