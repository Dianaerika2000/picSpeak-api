import { IndividualUser } from "src/users/entities/individual-user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { Message } from "./message.entity";

@Entity()
export class Chat {
    @Column({ primary: true, generated: true })
    id: number;

    @Column({ nullable: true })
    fondo: string;

    @Column({ type: 'boolean', default: true })
    status: boolean;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    //Connected users
    @ManyToOne(() => IndividualUser, (user) => user.senderChat)
    senderUser: IndividualUser;

    @ManyToOne(() => IndividualUser, (user) => user.receivingChat)
    receivingUser: IndividualUser;

    //TODO: Connect with message table 1...*
    @OneToMany(() => Message, (message) => message.chat)
    messages: Message[];
}
