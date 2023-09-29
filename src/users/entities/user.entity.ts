import { UserType } from "src/enums/user-type.enum";
import { IndividualUser } from "src/individual-users/entities/individual-user.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @Column({ primary: true, generated: true})
    id: number;

    @Column({ name: 'photo_url'})
    photoUrl: string;

    @Column({
        type: "enum",
        enum: UserType,
        default: UserType.IND,})
    type: UserType;

    @CreateDateColumn({ name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at'})
    deletedAt: Date;

    @OneToOne(() => IndividualUser, individual => individual.user)
    individual: IndividualUser; 
}
