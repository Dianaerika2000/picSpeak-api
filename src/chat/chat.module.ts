import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from 'src/message/entities/chat.entity';

@Module({
  providers: [ChatGateway, ChatService],
  imports: [Chat],
  exports: [ChatService] 
})
export class ChatModule {}
