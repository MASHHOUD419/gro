import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { Type } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, } from 'class-validator';
import { Transform } from 'class-transformer';
import { AbstractDto } from '../../../shared/dto';
import { PRIORITY_LEVEL } from '../entities/task.entity';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional()
  responsibility_id: number;

  owner_id: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional()
  due_date: Date;

  @IsOptional()
  @ApiPropertyOptional({ default : false})
  notification_enabled: boolean;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Number format : total minutes converted :  eg: 2h = 120mins'})
  notification_time: number;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Number format : total minutes converted :  eg: 2h = 120mins'})
  duration: number;

  @IsOptional()
  @ApiPropertyOptional({ default: PRIORITY_LEVEL.MEDIUM, description: 'LOWEST = 200, LOW = 600, MEDIUM = 1100, HIGH = 1600, HIGHEST = 2000'})
  priority: PRIORITY_LEVEL;

  @IsOptional()
  @ApiPropertyOptional()
  link: string;

  @IsOptional()
  @ApiPropertyOptional()
  comments: string;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  starred: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  completed: boolean;
}
