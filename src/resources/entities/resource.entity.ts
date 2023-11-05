import { Image } from "src/images/entities/image.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class Resource {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ nullable: false, default: 'image'})
    type: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @OneToOne(() => Image, image => image.resource)
    image: Image;
}
