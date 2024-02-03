import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { Chat } from 'src/message/entities/chat.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { MessageModule } from 'src/message/message.module';
import { OfflineMessage } from './entity/offlineMessage.entity';
import { GoogleCloudModule } from 'src/google-cloud/google-cloud.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, OfflineMessage]),
    UsersModule,
    MessageModule,
    GoogleCloudModule,
  ],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService],
  exports: [ChatService] 
})
export class ChatModule {}
