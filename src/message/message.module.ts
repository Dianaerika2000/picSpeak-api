import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { Chat } from './entities/chat.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, Chat]),
    UsersModule,
    ResourcesModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
  exports: [MessageService]
})

export class MessageModule {}
