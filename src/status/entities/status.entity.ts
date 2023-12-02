import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm'

@Entity()
export class Status {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'status_info', nullable: false })
    statusInfo: string;

    @Column({ name: 'icon', nullable: true })
    icon: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

}