import { Message } from "src/message/entities/message.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Text extends Resource {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ nullable: false, name: 'text_origin'})
    textOrigin: string;

    @Column({ nullable: false, name: 'text_translate'})
    textTranslate: string;

    @ManyToOne(() => Message, (message) => message.text)
    message: Message
}
