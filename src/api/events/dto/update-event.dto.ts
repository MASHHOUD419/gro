import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateEventDto extends PartialType(CreateEventDto) {

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  name: string;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  begin_date: Date;

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  @ApiPropertyOptional()
  end_date: Date;

  // @ApiPropertyOptional()
  // begin_time: string;

  // @ApiPropertyOptional()
  // end_time: string;

  @IsNumber()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Number format : total minutes converted :  eg: 2h = 120mins'})
  notification_time: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  location: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  link: string;

  // @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  note: string;
}
