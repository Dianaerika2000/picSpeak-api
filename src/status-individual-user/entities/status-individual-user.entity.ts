
import { IndividualUser } from 'src/users/entities/individual-user.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn } from 'typeorm'

@Entity()
export class StatusIndividualUser {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'status_info', nullable: false })
    status_info: string;

    @Column({ nullable: true })
    icon: string;

    @Column({ name: 'status', default: true })
    status: Boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @ManyToOne(() => IndividualUser, (individualuser) => individualuser.statusIndividualUser)
    @JoinColumn({ name: 'user_id' })
    individualuser: IndividualUser;
}