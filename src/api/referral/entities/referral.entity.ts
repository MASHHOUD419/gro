import { AbstractEntity } from 'src/shared/entities';
import {
    Unique,
    PrimaryGeneratedColumn,
    Column,
    Entity,
} from 'typeorm';
import { referralDTO } from '../dto/referral.dto';



@Entity()
@Unique(['id'])
export class referral extends AbstractEntity<referralDTO> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    type: string;

    @Column()
    userId:number;

    @Column()
    invitedUserPhoneNo?: string;

    @Column()
    invitedUserEmail?: string;

    @Column()
    messageBody: string;

    @Column()
    createdOnDate?:number;

    @Column()
    isPremium?:boolean;

    dtoClass=referralDTO

}