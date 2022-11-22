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
  IsNumber,
  IsArray,
  IsOptional
} from "class-validator";
import { Type } from 'class-transformer';
import { AbstractDto } from '../../../shared/dto';
import { EventAttendeeDto } from "./event-attendee.dto";


export class CreateEventDto {

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  // @IsNotEmpty()
  // @IsDate()
  // @Type(() => Date)
  // @ApiProperty()
  // event_date: Date;

  owner_id: number;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: '2022-10-25 16:08' })
  begin_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty({ default: '2022-10-25 17:08' })
  end_date: Date;

  // @IsNotEmpty()
  // @ApiProperty()
  // begin_time: string;

  // @IsNotEmpty()
  // @ApiProperty()
  // end_time: string;

  // @IsNotEmpty()
  // @ApiProperty({ description: 'Number format : total minutes converted :  eg: 2h = 120mins'})
  // notification_time: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  location: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  link: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  note: string;

  // @IsArray()
  // @IsOptional()
  // @ApiPropertyOptional({ type: [EventAttendeeDto] })
  // attendees: EventAttendeeDto[]
}
