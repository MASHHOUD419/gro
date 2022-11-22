import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
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
} from "class-validator"

import { ToBoolean } from "src/shared/decorators/boolean-transformer.decorator";
import { RegisterType } from "../entities";
import { LoginType } from 'src/api/auth/auth.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @IsEmail()
    @IsOptional()
    @ApiPropertyOptional()
    email: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    @Length(6, 50)
    password: string;

    @IsOptional()
    @ApiPropertyOptional()
    username: string;

    @IsOptional()
    @ApiPropertyOptional()
    fullname: string;

    @IsOptional()
    @ApiPropertyOptional()
    birthday: string;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional()
    phone_number: string;

    @IsOptional()
    @ApiPropertyOptional({default: LoginType.EMAIL, description:'type can be seen from table loginTypes'})
    register_type: LoginType;

    @IsOptional()
    @ApiPropertyOptional({description: 'Upload user photo'})
    file: any;

    @IsOptional()
    @IsString()
    photo: string;

    @IsOptional()
    @ToBoolean()
    @ApiPropertyOptional({default: 0})
    completed_tutorial: boolean;
    
    @IsOptional()
    @ToBoolean()
    @ApiPropertyOptional({default: 0})
    coming_soon_notif : boolean;

    @IsOptional()
    @ToBoolean()
    @ApiPropertyOptional({default: 0})
    tester: boolean;

    @IsOptional()
    @ToBoolean()
    @ApiPropertyOptional({default: 0})
    is_premium_member:number;

    verify_code: number;
}
