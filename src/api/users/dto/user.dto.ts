import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { LoginType } from 'src/api/auth/auth.dto';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

import { AbstractDto } from '../../../shared/dto';
import { User as UserEntity } from '../entities';

export class UserDto extends AbstractDto {

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  username: string;

  @IsNotEmpty()
  @ApiProperty()
  fullname: string;

  @IsNotEmpty()
  referral_code: string;

  @IsNotEmpty()
  @ApiProperty({ name: 'phone_number' })
  phoneNumber: string;

  @IsNotEmpty()
  @ApiProperty({ name: 'verified' })
  verified: boolean;

  @IsOptional()
  // @ApiPropertyOptional({ name: 'verify_code' })
  verify_code: number;

  @IsOptional()
  // @ApiPropertyOptional()
  reset_pwd_code?: number;

  @IsOptional()
  @ApiProperty()
  photo: string;

  @IsBoolean()
  @ToBoolean()
  @ApiProperty({ default: 0 })
  is_premium_member:number;

  @IsBoolean()
  @ToBoolean()
  @ApiProperty({ default: 0 })
  tester: boolean;

  @IsNotEmpty()
  @ToBoolean()
  @ApiProperty({ default: 0 })
  completed_tutorial: boolean;
  
  @IsNotEmpty()
  @ToBoolean()
  @ApiProperty({ default: 0 })
  coming_soon_notif: boolean;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ default: LoginType.EMAILPASSWORD })
  register_type: LoginType;
  constructor(user: UserEntity) {
    super(user);
    this.fullname = user.fullname;
    this.username = user.username;
    this.email = user.email;
    this.photo = user.photo;
    this.fullname = user.fullname;
    this.phoneNumber = user.phone_number;
    this.verified = user.verified;
    this.is_premium_member = user.is_premium_member;
    this.tester = user.tester;
  }
}
