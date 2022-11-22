import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
  Logger,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {  UserDto } from './dto';
import { generateUserNameAndPass } from './dto/generateUserNamePass.dto';
@ApiTags('User')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  // @Post()
  // create(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Get()
  @ApiOperation({
    summary: "Get All app users",
    description: "Also should attach Bear token"
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get One user",
    description: "Also should attach Bear token"
  })
  async findOne(@Param('id') id: string) {
    return new UserDto(await this.usersService.findOne(+id));
  }

  @Post(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: "Edit one user",
    description: "Also should attach Bear token"
  })

  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const updated = await this.usersService.update(+id, updateUserDto, file);
    return {
      status: 1,
      message: 'user updated',
      id
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Delete one user",
    description: "Also should attach Bear token"
  })
  async remove(@Param('id') id: string) {
    const deleted = this.usersService.remove(+id);
    if (!deleted)
      return {
        status: 0,
        message: 'something is wrong',
        id
      };
    return {
      status: 1,
      message: 'User deleted',
      id
    };
  }

  @Get('/profile/:id')
  @ApiOperation({
    summary: "Get user profile",
    description: "Also should attach Bear token"
  })
  async getUserProfile(@Param('id') id: string) {
    const user = await this.usersService.userProfile(+id);
    return {
      status: 1,
      message: 'user profile info',
      data: user
    }
  }

  @Get('/streak/current')
  @ApiOperation({
    summary: "Get user current streak value",
    description: "Also should attach Bear token"
  })
  async getCurrentStreak(@Req() req: any) {
    const userId = req.user.id;

    return this.usersService.getUserStreak(+userId);
  }

  @Get('/streak/longest/alltime')
  @ApiOperation({
    summary: "Get user longest streak value",
    description: "Also should attach Bear token"
  })
  async getLongestStreak(@Req() req: any) {
    const userId = req.user.id;

    return this.usersService.getLongestStreak(+userId);
  }
  @Get('/streak/longest/monthly')
  @ApiOperation({
    summary: "Get user longest streak value",
    description: "Also should attach Bear token"
  })
  async getMonthlyLongestStreak(@Req() req: any) {
    const userId = req.user.id;

    return this.usersService.getMonthlyLongestStreak(+userId);
  }

  @Post('/profile/:id')
  @ApiOperation({
    summary: "Get user profile",
    description: "Also should attach Bear token"
  })
  async updateUserProfile(@Param('id') id: string, @Body() body: any) {
    // const user = await 
  }


  

  @Post('/generateUserNamePass')
  @ApiOperation({
    summary: "generate userName and Password",
    description: ""
  })
  async generateUserPass(
    @Body() data:generateUserNameAndPass,
  ) {
    return await this.usersService.generateUserNamePass(data)
    
  }




}
