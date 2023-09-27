import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class IndividualUser {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ nullable: false})
    name: string;

    @Column()
    lastname: string;

    @Column({ name: 'birth_date', nullable: false})
    birthDate: Date;

    @Column({ nullable: false})
    gender: string;

    @Column({ nullable: false})
    nationality: string;

    @Column({ unique: true, nullable: false})
    email: string;

    @Column({ nullable: false})
    password: string;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;
    
    @OneToOne(() => User, user => user.individual)
    user: User; 
}
