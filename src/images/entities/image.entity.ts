import { Resource } from "src/resources/entities/resource.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class Image {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ nullable: false})
    url: string;

    @Column({ nullable: false, name: 'path_device'})
    pathDevice: string;

    @Column({ nullable: false})
    content: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @OneToOne(() => Resource, resource => resource.image, { cascade: true})
    @JoinColumn({ name: 'resource_id'})
    resource: Resource;
}
