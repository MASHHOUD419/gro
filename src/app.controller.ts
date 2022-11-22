import {
  Controller,
  Post,
  Get,
  UploadedFile,
  UseInterceptors,
  Request,
  Logger
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AppService } from './app.service';
import { CalendarsService } from './api/calendars/calendars.service';
import { FileService } from './shared/services/file.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly fileservice: FileService,
    private readonly calendarService: CalendarsService,
  ) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('calendar')
  async getCalendar() {
    const data = await this.calendarService.authorize()
      .then(this.calendarService.listEvents);
    return { status: 1, data }
  }

  @Get('oauth2callback')
  getTestUpcomingEvents(): string {
    return 'calendar';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ): Promise<any> {

    const result = await this.fileservice.uploadPublicFile(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    return new Response(result);
  }
}

export class Response<T> {
  public payload: T;
  public messages: string[];

  constructor(obj: T, msg?: string[]) {
    this.payload = obj;
    this.messages = [];
  }
}