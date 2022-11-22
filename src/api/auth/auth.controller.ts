import {
    Controller,
    Get,
    Post,
    Body,
    Res,
    Req,
    Request,
    Logger,
    UseGuards,
    UseInterceptors,
    UploadedFile,
    BadRequestException,
    Param,
    Query
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import {
    ApiTags,
    ApiResponse,
    ApiOperation,
    ApiBody,
    ApiBearerAuth
} from "@nestjs/swagger";

import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { CodeDto, EmailDTO, ForgotPasswordDTO, LoginResponseDTO, LoginType, ResetPasswordDto, SendLoginCodeDto, SignupResponseDTO, UserLoginDto, UsernameDto } from './auth.dto';
import { ErrorResponseDTO } from 'src/shared/dto';
import TokenVerificationDto from './dto/token.verification.dto';
import { GoogleAuthenticationService } from './google.authentication.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { AppleAuthenticationService } from './apple_authentication.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';

@ApiTags("Auth")
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly googleAuthService: GoogleAuthenticationService,
        private readonly appleAuthService: AppleAuthenticationService
    ) {

    }
    @ApiOperation({
        summary: "snap chat login.",
        description: "login with snap chat"
    })
    @Get("/snapchat")
    @UseGuards(AuthGuard("snapchat"))
    async snapLogin(): Promise<any> {
        return "snap login";
    }

    @Get("/snapchat/callback")
    @UseGuards(AuthGuard("snapchat"))
    async snapChatLoginRedirect(@Req() req): Promise<any> {
        return {
            data: req.user,
        };
    }



    @Post('register')
    @UseInterceptors(FileInterceptor('file'))
    @ApiOperation({
        summary: "User register endpoint.",
        description: `regester type is ${LoginType.EMAILPASSCODE} and ${LoginType.PHONEPASSCODE}`
    })
    @ApiResponse({ status: 200, type: SignupResponseDTO, description: "Verify your phone number" })
    @ApiResponse({ status: 400, type: ErrorResponseDTO, description: "Validation error" })
    async register(
        @UploadedFile() file: Express.Multer.File,
        @Body() createUserDto: CreateUserDto
    ) {
        const user = await this.authService.createSaoud(createUserDto, file);
        return user;
    }

    // @ApiBody({ type: UserLoginDto })
    @Post('login')
    // @UseGuards(LocalAuthGuard)
    @ApiOperation({
        summary: "User login endpoint.",
        description: "User login:  you can use one of  'email/password' and 'phone_number/code'. To get code please use the api - '/send_login_code'"
    })
    @ApiResponse({ status: 200, type: LoginResponseDTO, description: "User login" })
    @ApiResponse({ status: 400, type: ErrorResponseDTO, description: "Validation error" })
    async login(@Body() userLoginDto: UserLoginDto, @Request() req: any) {
        return this.authService.loginSaoud(userLoginDto)
    }

    @Post('google')
    @ApiOperation({
        summary: "Google signin endpoint.",
        description: "User Google signin"
    })
    async authenticateGoogle(@Body() tokenData: TokenVerificationDto, @Req() request: Request) {
        return this.googleAuthService.authenticate(tokenData.token);
    }

    @Post('apple')
    @ApiOperation({
        summary: "Apple signin endpoint.",
        description: "User Apple signin"
    })
    async authenticateApple(@Body() tokenData: TokenVerificationDto, @Req() request: Request) {
        const email = await this.appleAuthService.authenticate(tokenData.token);
        return { status: 1, data: { email } }
    }

    @Post('/verify_code')
    @ApiOperation({
        summary: "Verify your phone number or email address with the code.",
        description: "Verify your phone number or email.\nParams should be  the code and userId which will be retrieved from the registration api."
    })
    async verifyCode(@Body() codeDto: CodeDto, @Req() req: any) {
        // const userId = req.user.id;
        return this.authService.verifyCode(codeDto.code, codeDto.userId);
    }

    @Post('/forgot_password')
    @ApiOperation({
        summary: "Forgot Password.",
        description: "Attach your email address. You will get a link to reset your password."
    })
    async forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO, @Req() req: any) {
        // const userId = req.user.id;
        return this.authService.forgotPassword(forgotPasswordDTO);
    }

    @Post('/socialLogin')
    @ApiOperation({
        summary: "social logins",
        description: "user login from different social media platform"
    })
    async socialLogins(@Body() socialLogin:CreateUserDto) {
        return this.authService.socialMediaLogin(socialLogin)
    }


    @ApiBearerAuth('access-token')
    @Post('/reset_password')
    @UseGuards(JwtAuthGuard)
    @ApiOperation({
        summary: "Reset your Password.",
        description: "Attach your current password, new password, confirm password. Also should attach Bear token"
    })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Req() req: any) {
        const userId = req.user.id;
        return this.authService.resetPassword(resetPasswordDto, userId);
    }

    @Get('/validate_username?')
    @ApiOperation({
        summary: "Validate your username.",
        description: "Validate username in the front side."
    })
    async validateUsername(@Query('username') usernameDto: string) {
        Logger.log(usernameDto);
        return this.authService.validateUsername(usernameDto);
    }

    @Post('/send_login_code')
    @ApiOperation({
        summary: "Send SMS for phone number login"
    })
    async sendCode(@Body() codeDto: SendLoginCodeDto, @Req() req: any) {
        // const userId = req.user.id;
        return this.authService.sendLoginCode(codeDto);
    }

    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthGuard)
    @Post('/logout')
    @ApiOperation({
        summary: "Logout endpoint.",
        description: "User logout api. Access token is required."
    })
    @ApiResponse({ status: 201, description: "New access_token, refresh_token are returned." })
    @ApiResponse({ status: 400, type: ErrorResponseDTO, description: "Validation error" })
    async logout(@Req() req: any) {
        Logger.log(req.user.id);
        const user = await this.authService.logout(req.user.id);
        if (!user) throw new BadRequestException('user not found')
        return { msg: 'Signed out successfully', status: 1 }
    }


}
