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
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
} from "class-validator"
import { FolderDto } from "../dto";
import { UserDto } from "src/api/users/dto";
import { Responsibility } from "src/api/responsibilities/entities/responsibility.entity";
import { FolderReponsibility } from "./folder-responsibility.entity";

@Entity()
@Unique(['id'])
export class Folder extends AbstractEntity<FolderDto> {
  @Column({ unique: true })
  name: string;

  @Column()
  owner_id: number; // userid

  @Column()
  icon?: string;

  @Column()
  color?: string;

  @Column()
  photo?: string;

  @Column()
  category?: string;

  @Column({ default: false })
  completed: boolean;

  @Column({ nullable: true, default: null })
  completed_at: Date;

  @Column({ default: false })
  completable: boolean;

  // @Column({ default: 0 })
  // responsibilities: number;

  @OneToMany(type => Responsibility, (responsibilitiy: Responsibility) => responsibilitiy.folder_id, {
    nullable: true,
  })
  responsibilities: Responsibility[];

  @OneToMany(type => FolderReponsibility, (folderResponsibilitiy: FolderReponsibility) => folderResponsibilitiy.folder, {
    nullable: true,
  })
  folderResponsibilitiies: FolderReponsibility[];

  dtoClass = FolderDto;
}