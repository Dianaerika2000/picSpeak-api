import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity('individualUsers')
export class IndividualUser extends User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column()
    lastname: string;

    @Column({ nullable: true })
    username: string;

    @Column({ name: 'birth_date', nullable: false })
    birthDate: Date;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    nationality: string;

    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true, name: 'activation_token' })
    activationToken: string;

    @Column({ type: 'boolean', default: false })
    active: boolean;
}
