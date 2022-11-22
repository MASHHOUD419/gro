import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { SharedModule } from 'src/shared/shared.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from './entities/event.entity';
import { Attendee } from './entities/attendee.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Event, Attendee]),
    SharedModule
  ],
  controllers: [EventsController],
  providers: [EventsService]
})
export class EventsModule {}
