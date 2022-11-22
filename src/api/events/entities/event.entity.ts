import { type } from "os";
import { AbstractEntity } from "src/shared/entities";
import {
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
  JoinColumn,
  JoinTable,
} from 'typeorm';
import { EventDto } from "../dto";
import { Attendee } from "./attendee.entity";

@Entity()
@Unique(['id'])
export class Event extends AbstractEntity<EventDto> {
  @Column()
  name: string;

  // @Column({ type: 'datetime' })
  // event_date: Date;
  
  @Column()
  owner_id: number; // userid

  @Column({ type: 'datetime' })
  begin_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  // @Column({ type: 'time' })
  // begin_time: Date;

  // @Column({ type: 'time' })
  // end_time: Date;

  @Column()
  notification_time?: number; // total minutes

  @Column()
  link?: string;
  
  @Column()
  location?: string;

  @Column()
  note?: string;

  // @OneToMany(() => Attendee, (attendee: Attendee) => attendee.event_id, {
  // @OneToMany(type =>  Attendee, (attendee: Attendee) => attendee.event, {
  //   nullable: false,
  // })
  // attendees: Attendee[];

  dtoClass = EventDto;
}
