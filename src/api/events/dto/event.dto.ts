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
} from "class-validator";
import { Type } from 'class-transformer';
import { AbstractDto } from '../../../shared/dto';


export class EventDto extends AbstractDto{

  @IsNotEmpty()
  @ApiProperty()
  name: string;

  // @IsNotEmpty()
  // @IsDate()
  // @Type(() => Date)
  // @ApiProperty()
  // event_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  begin_date: Date;

  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  @ApiProperty()
  end_date: Date;

  // @IsNotEmpty()
  // @IsDate()
  // @Type(() => Date)
  // @ApiProperty()
  // begin_time: Date;

  // @IsNotEmpty()
  // @IsDate()
  // @Type(() => Date)
  // @ApiProperty()
  // end_time: Date;

  // @IsNotEmpty()
  // @ApiProperty({ description: 'Number format : total minutes converted :  eg: 2h = 120mins'})
  // notification_time: number;

  @IsNotEmpty()
  @ApiProperty()
  location: string;

  @IsNotEmpty()
  @ApiProperty()
  link: string;

  // @IsNotEmpty()
  @ApiPropertyOptional()
  note: string;
}
