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
  IsBoolean,
  IsOptional
} from "class-validator"
import { ToBoolean } from "src/shared/decorators/boolean-transformer.decorator";
import { RESPONSIBILITY_TYPE } from "./responsibility.dto";

export class CreateResponsibilityDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  owner_id: number;

  @IsString()
  @IsOptional()
  // @ApiPropertyOptional()
  color: string;

  @IsString()
  @IsOptional()
  // @ApiPropertyOptional()
  icon: string;

  @IsString()
  @IsOptional()
  // @ApiPropertyOptional()
  photo: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  link: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  category: string;

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional()
  folder_id: number;

  @IsBoolean()
  @IsNotEmpty()
  @ToBoolean()
  @ApiProperty()
  completable: boolean;

  @IsNotEmpty()
  @IsOptional()
  @ApiPropertyOptional({ description: 'Responsibility type , 0 : LOCAL, 1 :  CANVAS'})
  type: RESPONSIBILITY_TYPE;

  @IsNotEmpty()
  @ApiProperty({ description: 'Upload responsibility photo' })
  file: any;
}