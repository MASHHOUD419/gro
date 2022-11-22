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
} from 'typeorm';
import { StreakDto } from "../dto/streak.dto";

@Entity()
@Unique(['id'])

export class Streak extends AbstractEntity<StreakDto> {
  @Column()
  user_id: number;
  @Column()
  last_value: number;
  @Column({ type: 'date', default: null })
  lastCompletionDate: Date;

  dtoClass = StreakDto;
}
