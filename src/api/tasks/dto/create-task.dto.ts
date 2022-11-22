import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

import { AbstractDto } from '../../../shared/dto';
import { PRIORITY_LEVEL } from '../entities/task.entity';
import { TASK_TYPE } from './task.dto';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

export class CreateTaskDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
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

  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  @ApiPropertyOptional({ default : 0})
  starred: boolean;
}
