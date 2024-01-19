import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class OfflineMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  senderId: number;

  @Column()
  receiverId: number;

  @Column() 
  content: string; 

  @Column({nullable: true})
  messageId: string; 

  @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at'})
  createdAt: Date; 

  @Column({default: false})
  delivered: boolean;
}