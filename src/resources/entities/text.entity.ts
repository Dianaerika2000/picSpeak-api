import { Resource } from "src/resources/entities/resource.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Text extends Resource {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ nullable: false, name: 'text_origin'})
    textOrigin: string;

    @Column({ nullable: false, name: 'text_translate'})
    textTranslate: string;
}
