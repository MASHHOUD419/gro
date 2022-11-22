import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AbstractDto } from '../../../shared/dto';

export enum RESPONSIBILITY_TYPE {
  CANVAS = 0,
  LOCAL,
}

export class ResponsibilityDto extends AbstractDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsOptional()
  @ApiPropertyOptional()
  color: string;

  @IsOptional()
  @ApiPropertyOptional()
  icon: string;

  @IsOptional()
  @ApiPropertyOptional()
  photo: string;

  @IsOptional()
  @ApiProperty()
  folder_id: number;

  @IsOptional()
  @ApiProperty()
  type: RESPONSIBILITY_TYPE;

  @IsOptional()
  @ApiProperty()
  completed: boolean;

  @IsOptional()
  @ApiProperty()
  completed_at: string;

  @IsOptional()
  @ApiProperty()
  completable: boolean;
}