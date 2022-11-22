import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class createReferral {
    @IsNotEmpty()
    @IsString()
    @ApiProperty()
    messageBody: string="";



    @IsOptional()
    @IsString()
    @ApiProperty()
    invitedUserPhoneNo: string="";

    
    @IsOptional()
    @IsEmail()
    @ApiProperty()
    invitedUserEmail: string="";

    @IsNumber()
    createdOnDate: number = new Date().getTime();

  

    @IsString()
    userId:number=0;

    @IsString()
    @IsNotEmpty()
    type: string="";

    @IsBoolean()
    @IsOptional()
    isPremium:boolean=true;


}