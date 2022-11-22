import { PartialType } from '@nestjs/mapped-types';
import { CreateFolderDto } from './create-folder.dto';
import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

export class UpdateFolderDto extends PartialType(CreateFolderDto) {
  
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  name: string;

  // @IsString()
  // @ApiPropertyOptional()
  // icon: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  category?: string;


  // @IsString()
  // @ApiPropertyOptional()
  // color: string;

  // @IsString()
  // @ApiPropertyOptional()
  // photo: string;

  @IsOptional()
  @ApiProperty()
  responsibilities: any[];

  @IsOptional()
  @IsBoolean()
  @ToBoolean()
  @ApiPropertyOptional()
  completable: boolean;

  @IsOptional()
  @ApiPropertyOptional({ description: 'Upload folder photo' })
  file: any;
}
