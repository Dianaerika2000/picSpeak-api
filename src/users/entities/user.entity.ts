import { IndividualUser } from "src/individual-users/entities/individual-user.entity";

import { Nacionality } from "src/nacionality/entities/nacionality.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, OneToOne, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { InappropriateContentUser } from "../../configuration/entities/inappropriate_content_user.entity";
import { InterestUser } from "../../configuration/entities/interest_user.entity";
import { LanguageUser } from "../../configuration/entities/language_user.entity";

@Entity()
export class User {
    @Column({ primary: true, generated: true })
    id: number;

    @Column({ name: 'photo_url' })
    photoUrl: string;

    @Column({ nullable: false, default: 'individual' })
    type: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @DeleteDateColumn({ name: 'deleted_at' })
    deletedAt: Date;

    @OneToOne(() => IndividualUser, individual => individual.user)
    individual: IndividualUser;

    //Relaciones de la configuración del usuario
    @ManyToOne(() => Nacionality, (nacionality) => nacionality.users)
    @JoinColumn({ name: 'nacionality_id' })
    nacionality: Nacionality;

    @OneToMany(() => InappropriateContentUser, (inappropriateContentUser) => inappropriateContentUser.user)
    inappropriateContentUsers: InappropriateContentUser[];

    @OneToMany(() => InterestUser, (interestUser) => interestUser.user)
    interestUsers: InterestUser[];

    @OneToMany(() => LanguageUser, (languageUser) => languageUser.user)
    languageUsers: LanguageUser[];
   
}
