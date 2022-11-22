import { Controller, Get, Post, Body, Req, Param, Delete, UseGuards } from '@nestjs/common';
import { referralService } from './referral.service';
import { referralDTO } from './dto/referral.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { invitation } from './dto/invitationDTO';

@ApiTags('Referral')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('referral')
export class referralController {
  constructor(private readonly referralService: referralService) {}
 
  @Post()
  @ApiOperation({
    summary: "create Referral",
    description: "Also should attach Bear token"
  })
  create(@Body() referralDTO: referralDTO) {
    return this.referralService.create(referralDTO);
  }

  @Post('invite')
  @ApiOperation({
    summary: "send invitation to friend",
    description: "Also should attach Bear token"
  })
  sendInvitaion(@Body() invite: invitation, @Req() req: any) {
    const userId = req.user.id;

    return this.referralService.sendInvitation(invite,userId);
  }

  @Get()
  findAll() {
    return "working";
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.referralService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.referralService.remove(+id);
  }
}
