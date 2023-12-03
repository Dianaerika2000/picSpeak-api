// import { IndividualUser } from "src/individual-users/entities/individual-user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { IndividualUser } from "src/users/entities/individual-user.entity";

@Entity()
export class Message {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IndividualUser, (user) => user.messages)
  individualUser: IndividualUser;

  //TODO Connecto to Chat table
  @ManyToOne(() => Chat, (message) => message.messages)
  chat: Chat;

  @OneToMany(() => Resource, (resources) => resources.message)
  resources: Resource[];
}
