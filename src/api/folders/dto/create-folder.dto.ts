import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

import { AbstractDto } from '../../../shared/dto';

export class CreateFolderDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  // @ApiPropertyOptional()
  icon: string;

  owner_id: number;

  @IsString()
  @IsOptional()
  // @ApiPropertyOptional()
  color: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  category: string;

  @IsString()
  @IsOptional()
  // @ApiPropertyOptional()
  photo: string;

  @IsArray()
  @IsNotEmpty()
  @ApiProperty()
  responsibilities: any[];

  @IsBoolean()
  @IsNotEmpty()
  @ToBoolean()
  @ApiProperty()
  completable: boolean;

  @IsOptional()
  @ApiProperty({ description: 'Upload folder photo' })
  file: any;
}