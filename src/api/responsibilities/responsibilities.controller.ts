import {
  Controller, Get, Post, Body, Patch, Param, Delete, UseGuards,
  Req,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { ResponsibilitiesService } from './responsibilities.service';
import { CreateResponsibilityDto } from './dto/create-responsibility.dto';
import { UpdateResponsibilityDto } from './dto/update-responsibility.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiBody,
  ApiBearerAuth
} from "@nestjs/swagger";
import { ErrorResponseDTO } from 'src/shared/dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Responsibility')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
@Controller('responsibilities')
export class ResponsibilitiesController {
  constructor(private readonly responsibilitiesService: ResponsibilitiesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: "Responsibility creation endpoint.",
    description: "Create a new responsibility"
  })
  @ApiResponse({ status: 200, description: "Responsibility created" })
  @ApiResponse({ status: 400, type: ErrorResponseDTO, description: "Error" })
  async create(
    @Body() createResponsibilityDto: CreateResponsibilityDto,
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File
  ) {
    const userId = req.user.id;
    createResponsibilityDto.owner_id = userId;
    const responsibility = await this.responsibilitiesService.create(createResponsibilityDto, file);

    return {
      status: 1,
      message: 'Responsibility created',
      data: {
        ...responsibility
      }
    };
  }

  @Get('folders/:id')
  @ApiOperation({
    summary: "Responsibilities as per folder",
    description: "get responsibility as per folder"
  })
 async responsibilitiesByFolder(
    @Req() req: any,
    @Param('id') id:string
  ) {
    const responsibilities = await this.responsibilitiesService.responsibilityByFolder(+id,req.user.id)
if(responsibilities){
  return {
    status: 1,
    message: 'Responsibilities as per folder',
    data: responsibilities
  };
}
else{
  return {
    status: 1,
    message: 'no data found',
    data: []
  };
}
  }

  @Get()
  @ApiOperation({
    summary: "Get all responsibilities endpoint.",
    description: "Get all responsibilities"
  })
  @ApiResponse({ status: 200, description: "Responsibility list" })
  @ApiResponse({ status: 400, type: ErrorResponseDTO, description: "Error" })
  async findAll(@Req() req: any) {
    const responsibilities = await this.responsibilitiesService.findAll(+req.user.id);

    return {
      status: 1,
      message: 'Responsibility list',
      data: responsibilities[0],
      count: responsibilities[1]
    }
  }

  @Get('/completed/all')
  @ApiOperation({
    summary: "Get all responsibilities completed endpoint.",
    description: "Get all completed responsibilities"
  })
  @ApiResponse({ status: 200, description: "Responsibility list" })
  @ApiResponse({ status: 400, type: ErrorResponseDTO, description: "Error" })
  async findAllCompleted(@Req() req: any) {
    const responsibilities = await this.responsibilitiesService.findAllCompleted(+req.user.id);

    return {
      status: 1,
      message: 'Responsibility list',
      data: responsibilities[0],
      count: responsibilities[1]
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const responsibility = await this.responsibilitiesService.findOne(+id);

    return {
      status: 1,
      message: 'responsibility info',
      data: {
        ...responsibility
      }
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('id') id: string, 
    @Body() updateResponsibilityDto: UpdateResponsibilityDto,
    @UploadedFile() file: Express.Multer.File) {
    const updated = await this.responsibilitiesService.update(+id, updateResponsibilityDto, file);
    const responsibility = await this.responsibilitiesService.findOne(+id);
    return {
      status: 1,
      message: 'responsibility updated',
      data: {
        ...responsibility
      }
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.responsibilitiesService.remove(+id);
    if (!deleted)
      return {
        status: 0,
        message: 'something is wrong',
        id
      };
    return {
      status: 1,
      message: 'responsibility deleted',
      id
    };
  }

  @Get('/user_monthly/:user_id')
  @ApiOperation({
    summary: "Get user monthly responsibility statistics for this month",
    description: "Required values are 'user_id'. Also should attach Bear token"
  })

  async getUserMonthlyStatistics(@Param('user_id') user_id: string) {
    return this.responsibilitiesService.getUserMonthlyStatistics(+user_id);
  }

  @Patch('/complete/:id')
  async completeResponsibility(@Param('id') id: string) {
    return this.responsibilitiesService.complete(+id);
  }



  
}
