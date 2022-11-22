import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
  Logger
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { result } from 'lodash';
import { Repository } from 'typeorm';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee } from './entities/attendee.entity';
import { Event } from './entities/event.entity';
@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
    @InjectRepository(Attendee)
    private attendeeRepository: Repository<Attendee>,
    // @Inject('MomentWrapper') private momentWrapper: moment.Moment
  ) { }
  async create(createEventDto: CreateEventDto) {
    const events = await this.findByNameAndId(createEventDto.name, createEventDto.owner_id);
    if (events.length > 0) throw new BadRequestException('Event name exist');
return events

//     const _eventRepository = this.eventRepository.create(createEventDto);

//     const event = await this.eventRepository.save(_eventRepository);
// if(event){
//   throw new BadRequestException('Event name exist');
// }
//     const attendees = createEventDto.attendees;
//     let results  = await Promise.all(attendees.map(async (attendee): Promise<any> => {
//       if(event.id){
//       attendee.event_id = event.id;
//       this.attendeeRepository.create(attendee)}    }));
//     // const attendeeRepositoryArr = attendees.map((attendee) => {
//     //   attendee.event_id = event.id;
//     //  this.attendeeRepository.create(attendee);
//     // });
//     if(results.length>0)
//     await this.attendeeRepository.save(results);
//     return event;
  }

  async findAll() {
    return this.eventRepository.findAndCount({
      relations: ['attendees'],
    });
  }

  async findOne(id: number) {
    const event = await this.eventRepository.findOne({
      where: { id },
      relations: ['attendees']
    });
    if (event) return event;
    return null;
  }

  async findByName(name: string) {
    const event = await this.eventRepository.findOneBy({ name });
    if (event) return event;
    return null;
  }

  async findByNameAndId(name: string, owner_id: number) {
    const events = await this.eventRepository.find({ where: { name, owner_id } });
    return events;
  }

  async update(id: number, updateeventDto: UpdateEventDto) {
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException('event not found');
    return this.eventRepository.update(id, updateeventDto);
  }

  async remove(id: number) {
    const event = await this.findOne(id);
    return this.eventRepository.remove(event);
  }
}
