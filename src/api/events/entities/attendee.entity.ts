import { AbstractEntity } from "src/shared/entities";
import {
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  ManyToOne,
  JoinColumn,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { EventAttendeeDto } from "../dto/event-attendee.dto";
import { Event } from "./event.entity";

@Entity({ name: 'event_attendee' })
@Unique(['id'])
export class Attendee extends AbstractEntity<EventAttendeeDto> {

  @Column()
  name: string;

  @Column()
  event_id: number;

  // @ManyToOne(type => Event)
  // @JoinColumn({ name: 'event_id', referencedColumnName: 'id' })
  // event: Event;

  @Column()
  email: string;

  @Column()
  avatar: string;

  dtoClass = EventAttendeeDto
}