import { User } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";

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

   /*  @Column({ nullable: false})
    gender: string; */

    @Column({ nullable: true})
    nationality: string;

    @Column({ unique: true, nullable: false})
    email: string;

    @Column({ nullable: false})
    password: string;

    @Column({ nullable:true, name: 'activation_token'})
    activationToken: string;

    @Column({ type: 'boolean', default: false})
    active: boolean;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;

    @OneToOne(() => User, user => user.individual, { cascade: true })
    @JoinColumn({ name: 'user_id'})
    user: User; 
}
