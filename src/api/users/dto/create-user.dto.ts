import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
    Contains,
    IsInt,
    Length,
    IsEmail,
    IsNotEmpty,
    IsFQDN,
    IsDate,
    Min,
    Max,
    IsString,
    IsOptional,
    IsBoolean,
} from "class-validator"
import { isBoolean } from "lodash";
import { LoginType } from "src/api/auth/auth.dto";
import { ToBoolean } from "src/shared/decorators/boolean-transformer.decorator";
import { RegisterType } from "../entities";
export class CreateUserDto {
    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Length(6, 50)
    password: string;

    @IsNotEmpty()
    @ApiProperty()
    username: string;

    @IsNotEmpty()
    @ApiProperty()
    fullname: string;

    @IsNotEmpty()
    @ApiProperty()
    birthday: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phone_number: string;

    @IsOptional()
    @ApiProperty({default: LoginType.EMAILPASSWORD, description:'type can be one of email, phone, google, apple'})
    register_type: LoginType;

    @ApiProperty({description: 'Upload user photo'})
    file: any;

    @IsOptional()
    @IsString()
    photo: string;

    @IsOptional()
    @IsBoolean()
    verified: boolean;

    @IsNotEmpty()
    @ToBoolean()
    @ApiProperty({default: 0})
    completed_tutorial: boolean;
    
    @IsNotEmpty()
    @ToBoolean()
    @ApiProperty({default: 0})
    coming_soon_notif : boolean;

    @IsNotEmpty()
    @ToBoolean()
    @ApiProperty({default: 0})
    tester: boolean;

    @IsNotEmpty()
    @ToBoolean()
    @ApiProperty({default: 0})
    is_premium_member:number;

    verify_code: number;
}