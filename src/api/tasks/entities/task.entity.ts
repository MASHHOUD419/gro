import { AbstractEntity } from "src/shared/entities";
import { Logger } from '@nestjs/common';
import {
  Unique,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import { TaskDto, TASK_TYPE } from "../dto/task.dto";


export enum PRIORITY_LEVEL {
  LOWEST = 200,
  LOW = 600,
  MEDIUM = 1100,
  HIGH = 1600,
  HIGHEST = 2000
}

@Entity()
@Unique(['id'])
export class Task extends AbstractEntity<TaskDto> {

  @Column()
  name: string;

  @Column()
  responsibility_id: number; // responsibility id

  @Column()
  owner_id: number; // userid

  @Column({ type: 'datetime', nullable: true, default: null })
  due_date?: Date;

  @Column({ default: false })
  notification_enabled?: boolean;

  @Column()
  notification_time?: number; // total minutes

  @Column()
  duration?: number; // total minutes

  @Column({ default: PRIORITY_LEVEL.MEDIUM })
  priority: PRIORITY_LEVEL;

  @Column()
  link?: string;

  @Column()
  starred?: boolean;

  @Column({ default: '' })
  comments?: string;

  @Column()
  gro_factor?: number;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true, default: null })
  completedDate: Date;

  @Column({ default: false })
  deleted: boolean;

  @Column({ default: TASK_TYPE.LOCAL })
  type?: TASK_TYPE;

  dtoClass = TaskDto;

  // @AfterLoad()
  // @AfterInsert()
  // @AfterUpdate()
  @BeforeInsert()
  calcGroFactor(): void {
    if (this.priority > 0 && this.duration > 0)
      this.gro_factor = Math.floor(this.priority / this.duration);
  }

  @BeforeUpdate()
  updateCompletionDate() {
    if (this.completed && this.completedDate === null) {
      this.completedDate = new Date();
    }
    
    if (this.priority > 0 && this.duration > 0)
      this.gro_factor = Math.floor(this.priority / this.duration);
  }

}
