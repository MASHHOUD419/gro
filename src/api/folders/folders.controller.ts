import {
  Controller, Get, Post, Body, Patch, Param, Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { FoldersService } from './folders.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { UpdateFolderDto } from './dto/update-folder.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth
} from "@nestjs/swagger";
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
@ApiTags('Folder')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('folders')
export class FoldersController {
  constructor(private readonly foldersService: FoldersService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createFolderDto: CreateFolderDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log(createFolderDto);

    const userId = req.user.id;
    createFolderDto.owner_id = userId;
    const folder = await this.foldersService.create(createFolderDto, file);
    return {
      status: 1,
      message: 'folder created',
      data: {
        ...folder
      }
    }
  }

  @Get()
  async findAll(@Req() req: any) {
    const userId = req.user.id;
    const folders = await this.foldersService.findAll(+userId);
    return {
      status: 1,
      message: 'folder list',
      data: folders[0],
      count: folders[1]
    }
  }

  @Get('/completed/all')
  async findAllCompleted(@Req() req: any) {
    const folders = await this.foldersService.findAllCompleted(+req.user.id);
    return {
      status: 1,
      message: 'folder list',
      data: folders[0],
      count: folders[1]
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const folder = await this.foldersService.findOneFolderInfo(+id);
    return {
      status: 1,
      message: 'folder info',
      data: {
        ...folder
      }
    }
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string,
    @Body() updateFolderDto: UpdateFolderDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const folder = await this.foldersService.update(+id, updateFolderDto, file);
    return {
      status: 1,
      message: 'folder updated',
      id
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.foldersService.remove(+id);
    if (!deleted)
      return {
        status: 0,
        message: 'something is wrong',
        id
      };
    return {
      status: 1,
      message: 'folder deleted',
      id
    };
  }

  @Patch('/complete/:id')
  async complete(@Param('id') id: string) {
    return this.foldersService.complete(+id);
  }
}
