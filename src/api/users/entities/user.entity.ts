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
import { UserDto } from "../dto/user.dto";
import { LoginType } from "src/api/auth/auth.dto";


export enum RegisterType {
    EMAIL = "email",
    GOOGLE = "google",
    APPLE = "apple",
    PHONE = "phone"
}

@Entity()
@Unique(['id'])
export class User extends AbstractEntity<UserDto> {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    username: string;

    @Column()
    fullname: string;

    @Column()
    phone_number?: string;

    @Column({ unique: true })
    email?: string;

    @Column()
    @Length(6, 10)
    password?: string;

    @Column({ default: '', nullable: true })
    photo?: string;

    @Column({ name: "verified", default: false })
    verified: boolean;

    @Column({ default: 0 })
    is_premium_member?:number;

    @Column({ default: false })
    completed_tutorial: boolean;

    @Column({ default: false })
    coming_soon_notif: boolean;

    @Column({ default: false })
    tester: boolean;

    @Column({ name: 'verify_code', nullable: true, default: null })
    verify_code?: number;

    @Column({ nullable: true, default: null })
    reset_pwd_code?: number;

    @Column({ nullable: true, default: null })
    refresh_token?: string;

    @Column({ type: 'enum', enum: LoginType, default: LoginType.EMAILPASSWORD })
    register_type: LoginType;

    @Column({ type: 'date', default: null })
    birthday?: Date;

    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: true,
    })
    updatedAt: Date;

    @Column({ default: 0 })
    streaks: number;

    @Column({ type: 'date', default: null })
    lastCompletionDate: Date;

    dtoClass = UserDto;
}