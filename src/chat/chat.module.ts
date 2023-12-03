import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from 'src/message/entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat]),
    UsersModule,
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService] 
})
export class ChatModule {}
