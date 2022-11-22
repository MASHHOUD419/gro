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
  ManyToOne,
  JoinColumn,
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
import { FolderReponsibilityDto } from "../dto/folder-responsibility.dto";
import { AbstractDto } from "src/shared/dto";
import { Folder } from "./folder.entity";

@Entity()
@Unique(['id'])
export class FolderReponsibility extends AbstractEntity<AbstractDto> {

  @Column()
  folder_id: number;

  @Column()
  responsibility_id: number;

  @ManyToOne(() => Folder)
  @JoinColumn({ name: 'folder_id', referencedColumnName: 'id'})
  folder: Folder;

  @ManyToOne(() => Responsibility)
  @JoinColumn({ name: 'responsibility_id', referencedColumnName: 'id'})
  responsibility: Responsibility;

  dtoClass = AbstractDto;
}