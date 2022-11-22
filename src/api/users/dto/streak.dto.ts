import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AbstractDto } from '../../../shared/dto';

export class StreakDto extends AbstractDto{
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  last_value: number;
}
export class CreateStreakDto {
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  last_value: number;

  constructor(streakDto) {
    this.user_id = streakDto.user_id;
    this.last_value = streakDto.last_value;    
  }
}