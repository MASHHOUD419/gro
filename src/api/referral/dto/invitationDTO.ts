import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class invitation  {
 

    @IsOptional()
    @IsString()
    @ApiProperty()
    countryCode: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    number: string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    type: string;


}

