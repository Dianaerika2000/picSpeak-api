// import { IndividualUser } from "src/individual-users/entities/individual-user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Chat } from "./chat.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { IndividualUser } from "src/users/entities/individual-user.entity";
import { Text } from "src/resources/entities/text.entity";
import { Image } from "src/resources/entities/image.entity";
import { Audio } from "src/resources/entities/audio.entity";

@Entity()
export class Message {
  @Column({ primary: true, generated: true })
  id: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ name: 'is_showing', default: true})
  isShowing: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => IndividualUser, (user) => user.messages)
  individualUser: IndividualUser;

  //TODO Connecto to Chat table
  @ManyToOne(() => Chat, (message) => message.messages)
  chat: Chat;

  @OneToMany(() => Text, (text) => text.message)
  text?: Text[];

  @OneToMany(() => Image, (image) => image.message)
  image?: Image[];

  @OneToMany(() => Audio, (audio) => audio.message)
  audio?: Audio[];
}
