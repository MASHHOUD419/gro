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
  Logger
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@ApiTags('Event')
@ApiBearerAuth('access-token')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: "Create your event.",
    description: "Attach required values. Also should attach Bear token"
  })
  async create(@Body() createEventDto: CreateEventDto, @Req() req: any) {
    const userId = req.user.id;
    createEventDto.owner_id = userId;
    const event = await this.eventsService.create(createEventDto);

    return {
      status: 1,
      message: 'event created',
      data: {
        ...event
      }
    }
  }

  @Get()
  @ApiOperation({
    summary: "Get all events.",
    description: "Attach required values. Also should attach Bear token"
  })
  async findAll() {
    const events = await this.eventsService.findAll();
    return {
      status: 1,
      message: 'events list',
      data: events[0],
      count: events[1]
    }
  }

  @Get(':id')
  @ApiOperation({
    summary: "Get your one event.",
    description: "Attach required values. Also should attach Bear token"
  })
  async findOne(@Param('id') id: string) {
    const event = await this.eventsService.findOne(+id);
    return {
      status: 1,
      message: 'event info',
      data: {
        ...event
      }
    }
  }

  @Patch(':id')
  @ApiOperation({
    summary: "Edit the event.",
    description: "Attach required values. Also should attach Bear token"
  })
  async update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
    const event = await this.eventsService.update(+id, updateEventDto);
    return {
      status: 1,
      message: 'event updated',
      id
    };
  }

  @Delete(':id')
  @ApiOperation({
    summary: "Delete the event.",
    description: "Attach required values. Also should attach Bear token"
  })
  async remove(@Param('id') id: string) {
    
    const deleted = await this.eventsService.remove(+id);
    if (!deleted)
      return {
        status: 0,
        message: 'something is wrong',
        id
      };
    return {
      status: 1,
      message: 'event deleted',
      id
    };
  }
}
