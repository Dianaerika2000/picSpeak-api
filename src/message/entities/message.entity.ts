import { IndividualUser } from "src/individual-users/entities/individual-user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class Message {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at'})
  updatedAt: Date;

  @ManyToOne(
    () => IndividualUser, 
    (user) => user.messages)
  individualUser: IndividualUser;
}
