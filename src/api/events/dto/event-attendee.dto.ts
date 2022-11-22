import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { AbstractDto } from '../../../shared/dto';

export class EventAttendeeDto extends AbstractDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsEmail()
  @ApiProperty({ default: 'someone@example.com' })
  email: string;

  @IsUrl()
  @IsOptional()
  @ApiProperty()
  avatar: string;

  @IsNumber()
  event_id: number;
}