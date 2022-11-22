import { PartialType } from '@nestjs/mapped-types';
import { CreateResponsibilityDto } from './create-responsibility.dto';

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
  IsBoolean,
  IsOptional,
} from "class-validator"
import { RESPONSIBILITY_TYPE } from "./responsibility.dto";
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';
export class UpdateResponsibilityDto extends PartialType(CreateResponsibilityDto) {
  @IsOptional()
  @ApiPropertyOptional()
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
  @ApiPropertyOptional()
  folder_id: number;
  
  owner_id: number;

  @IsOptional()
  @ApiPropertyOptional()
  link: string;

  @IsOptional()
  @ApiPropertyOptional()
  type: RESPONSIBILITY_TYPE;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  completable: boolean;

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  completed: boolean;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Upload responsibility photo file' })
  file: any;
}