import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AbstractDto } from '../../../shared/dto';

export enum TASK_TYPE  {
  CANVAS = 0,
  LOCAL,
}


export class TaskDto extends AbstractDto {  
  
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  responsibility: number;

  @IsNotEmpty()
  @ApiProperty()
  dueDate: string;

  @IsNotEmpty()
  @ApiProperty()
  notification: boolean;

  @IsNotEmpty()
  @ApiProperty()
  notificationTime: string;

  @IsNotEmpty()
  @ApiProperty()
  duration: number;

  @IsNotEmpty()
  @ApiProperty()
  priority: number;

  @IsNotEmpty()
  @ApiProperty()
  link: string;

  @IsNotEmpty()
  @ApiProperty()
  starred: boolean;

  @IsNotEmpty()
  @ApiProperty()
  comments: string;

  @IsNotEmpty()
  @ApiPropertyOptional()
  gro_factor: number;

  @IsNotEmpty()
  @ApiProperty()
  completed: boolean;

  @IsNotEmpty()
  @ApiProperty()
  completedDate: string;

  @IsNotEmpty()
  @ApiProperty()
  deleted: boolean;

  @IsNotEmpty()
  @ApiProperty()
  type: TASK_TYPE;

}