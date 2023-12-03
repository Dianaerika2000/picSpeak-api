import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';
import { UsersModule } from 'src/users/users.module';
import { ChatModule } from 'src/chat/chat.module';
import { ResourcesModule } from 'src/resources/resources.module';
import { ResourcesService } from 'src/resources/resources.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Message ]),
    UsersModule,
    ChatModule,
    ResourcesModule
  ],
  controllers: [MessageController],
  providers: [MessageService],
})

export class MessageModule {}
