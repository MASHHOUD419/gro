/* eslint-disable max-classes-per-file */
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateIf } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class UsernameDto {
    @IsString()
    @ApiProperty()
    username: string;
}

export class CredentialsDTO {
    // username: string;
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @ApiProperty()
    password: string;
}

export class CodeDto {
    @IsNumber()
    @ApiProperty()
    code: number;

    @IsNumber()
    @ApiProperty()
    userId: number;
}

export class ResetPasswordDto {
    @IsString()
    @ApiProperty()
    new_password: string;
    // @IsString()
    // @ApiProperty()
    // confirm_password: string;
    // @IsString()
    // @ApiProperty()
    // current_password: string;
    @IsNumber()
    @ApiProperty()
    code: number;
}

export class ForgotPasswordDTO {
    // username: string;
    @IsEmail()
    @ApiPropertyOptional()
    email: string;
}

export class EmailDTO {
    // username: string;
    @IsEmail()
    @ApiProperty()
    email: string;
}

export class SignupResponseDTO {
    @ApiProperty()
    status: number;
    @ApiProperty()
    message: string;
    @ApiProperty()
    id?: string;
}

export class GeneralResponseDTO {
    @ApiProperty()
    status: number;
    @ApiProperty()
    message: string;
}

export class LoginResponseDTO {
    @ApiProperty()
    msg: string;
    @ApiProperty()
    status: number;
    @ApiProperty()
    refresh_token: string;
    @ApiProperty()
    token_type: string;
    @ApiProperty()
    expires_in: number;
    @ApiProperty()
    user: any;
}

export class RefreshTokenDTO {
    @ApiProperty()
    status: number;
    @ApiProperty()
    refreshToken: string;
    @ApiProperty()
    accessToken: string;
}

export enum LoginType {
    EMAIL = "email",
    PHONEPASSWORD = "phonePassword",
    PHONEPASSCODE = "phonePasscode",
    EMAILPASSWORD= "emailPassword",
    EMAILPASSCODE= "emailPasscode",
    SNAPCHAT="snapchat",
    TIKTOK="tiktok",
    TWITTER="twitter",
    FACEBOOK="facebook",
    GOOGLE="google",
    APPLE="apple",
    USERNAME = 'username',

}

export class UserLoginDto {
    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    password: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phone_number: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    code: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ default: LoginType.EMAIL, description: "types are email, phonePassword and phonePasscode"})
    type: LoginType;
}

export class SendLoginCodeDto {
    @IsString()
    @ApiProperty()
    phone_number: string;
}

``