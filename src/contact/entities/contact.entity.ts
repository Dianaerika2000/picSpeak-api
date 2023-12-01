import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity()
export class Contact {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  nickname: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;
}