import { IndividualUser } from "src/users/entities/individual-user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class Contact {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ nullable: true })
  photo_url: string;

  @Column()
  nickname: string;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column()
  contactId: number

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
  
  //Relacion de Muchos a uno con individual User
  @ManyToOne(() => IndividualUser, (individualuser) => individualuser.contact)
  @JoinColumn({ name: 'user_id' })
  individualuser: IndividualUser;
}