import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { RegisterType } from '../entities';

export class generateUserNameAndPass {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  userId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ default: RegisterType.EMAIL })
  register_type: RegisterType

  
}
 
