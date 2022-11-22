import {
  ApiProperty,
  ApiPropertyOptional
} from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  isNotEmpty,
  IsNotEmpty,
  IsOptional,
  IsString
} from 'class-validator';
import { ToBoolean } from 'src/shared/decorators/boolean-transformer.decorator';

import { AbstractDto } from '../../../shared/dto';

export class FolderReponsibilityDto {
  @IsNotEmpty()
  folder_id: number;

  @IsNotEmpty()
  responsibility_id: number;
}