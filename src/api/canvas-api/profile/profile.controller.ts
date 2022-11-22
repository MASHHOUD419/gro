import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('Canvas/Profile')
@Controller('canvas/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
  ) { }


  @Get()
  @ApiOperation({
    summary: "My canvas profile.",
    description: "My canvas user profile."
  })
  @ApiResponse({ status: 200, /*type: SignupResponseDTO,*/ description: "Your profile" })
  @ApiResponse({ status: 400, /*type: ErrorResponseDTO, */description: "Error" })
  canvasUserProfile() {
    return this.profileService.userProfile();
  }

  // @Post()
  // create(@Body() createProfileDto: CreateProfileDto) {
  //   return this.profileService.create(createProfileDto);
  // }

  // @Get()
  // findAll() {
  //   return this.profileService.findAll();
  // }

  @Get(':id')
  @ApiOperation({
    summary: "Canvas User profile.",
    description: "Other canvas user profile. You have to attach other user's id."
  })
  @ApiResponse({ status: 200, /*type: SignupResponseDTO,*/ description: "Your profile" })
  @ApiResponse({ status: 400, /*type: ErrorResponseDTO, */description: "Error" })
  findOne(@Param('id') id: number) {
    return this.profileService.otherProfile(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
  //   return this.profileService.update(+id, updateProfileDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.profileService.remove(+id);
  // }
}
