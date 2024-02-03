import { Message } from 'src/message/entities/message.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Resource } from 'src/resources/entities/resource.entity';

@Entity()
export class Audio extends Resource {
  @Column({ primary: true, generated: true })
  id: number;

  @Column()
  type: string;

  @Column({ nullable: false, name: 'original_audio_url'})
  originalAudioUrl: string;

  @Column({ nullable: false, name: 'translated_audio_url'})
  translatedAudioUrl: string;

  @ManyToOne(() => Message, (message) => message.audio, { nullable: true})
  message: Message;
}
