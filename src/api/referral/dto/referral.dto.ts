import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsBoolean, IsEmail, IsNotEmpty, IsNotEmptyObject, IsNumber, IsOptional, IsString } from "class-validator";
import { AbstractDto } from "src/shared/dto";
import { referral } from "../entities/referral.entity";
export class referralDTO extends AbstractDto  {
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

    constructor(referralvar:referral){
        super(referralvar);
        this.invitedUserEmail= referralvar.invitedUserEmail
        this.invitedUserPhoneNo=referralvar.invitedUserPhoneNo
        this.type=referralvar.type
        this.createdOnDate= referralvar.createdOnDate
        this.isPremium= referralvar.isPremium
        this.messageBody= referralvar.messageBody
        this.userId= referralvar.userId
    }


}