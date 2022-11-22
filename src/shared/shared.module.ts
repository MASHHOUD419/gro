import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CanvaseService } from './services/canvas.service';
import EmailService from './services/emails.service';
import { FileService } from './services/file.service';
import { TasksModule } from 'src/api/tasks/tasks.module';

@Module({
    imports: [
        HttpModule,
    ],
    providers: [
        CanvaseService,
        EmailService,
        FileService
    ],
    exports: [
        CanvaseService,
        EmailService,
        FileService
    ],
    controllers: []
})
export class SharedModule { }