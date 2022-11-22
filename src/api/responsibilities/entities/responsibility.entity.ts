import { Folder, FolderReponsibility } from "src/api/folders/entities";
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
  ManyToOne,
} from 'typeorm';
import { ResponsibilityDto, RESPONSIBILITY_TYPE } from "../dto/responsibility.dto";

@Entity()
@Unique(['id'])
export class Responsibility extends AbstractEntity<ResponsibilityDto> {
  @Column()
  name: string;

  @Column()
  owner_id: number; // userid

  @Column()
  color?: string;

  @Column()
  icon?: string;

  @Column()
  photo?: string;

  @Column()
  folder_id?: number;

  @Column()
  link?: string;

  @Column()
  category?: string;

  @Column({ nullable: true, default: null })
  completed_at: Date;

  @Column({ default: false })
  completable: boolean;

  // @ManyToOne(
  //   () => Folder,
  //   (responsiblity: Folder) => responsiblity.userConfig,
  //   { nullable: false, onDelete: 'CASCADE' },
  // )
  // @JoinColumn({ name: 'folder_id' })
  // folder: Folder;

  @Column({ default: false })
  completed: boolean;

  @Column({ default: RESPONSIBILITY_TYPE.LOCAL })
  type: RESPONSIBILITY_TYPE;

  @OneToMany((type) => FolderReponsibility,
    (folderResponsibilitiy: FolderReponsibility) => folderResponsibilitiy.responsibility,
    {
      nullable: true,
    }
  )
  folderResponsibilitiies: FolderReponsibility[];

  dtoClass = ResponsibilityDto;
}
