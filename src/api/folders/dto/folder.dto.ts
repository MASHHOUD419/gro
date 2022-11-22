import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

import { AbstractDto } from '../../../shared/dto';

export class FolderDto extends AbstractDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  icon: string;


  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  color: string;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional()
  photo: string;

  @IsBoolean()
  @IsOptional()
  @ToBoolean()
  completed: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  responsibilities: number;

  @IsOptional()
  @ApiProperty({ description: 'Upload folder photo' })
  file: any;

}