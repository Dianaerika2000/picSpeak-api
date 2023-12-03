import { Message } from "src/message/entities/message.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class Image extends Resource {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ nullable: false})
    url: string;

    @Column({ nullable: false, name: 'path_device'})
    pathDevice: string;

    @Column({ nullable: false})
    content: string;

    @ManyToOne(() => Message, (message) => message.image)
    message: Message
}
