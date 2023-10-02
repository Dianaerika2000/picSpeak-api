import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from 'typeorm';
import { Nacionality } from '../../nacionality/entities/nacionality.entity';
import { Language } from '../../language/entities/language.entity';

@Entity()
export class LanguageNacionality {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'status', default: true })
  status: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @ManyToOne(() => Nacionality, (nacionality) => nacionality.languageNacionalities)
  @JoinColumn({ name: 'nacionality_id' })
  nacionality: Nacionality;

  @ManyToOne(() => Language, (language) => language.nacionalityLanguages)
  @JoinColumn({ name: 'language_id' })
  language: Language;
}
