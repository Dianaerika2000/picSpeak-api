import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from './entities/contact.entity';
import { IndividualUser } from 'src/users/entities/individual-user.entity';
import { Chat } from 'src/message/entities/chat.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Contact,IndividualUser, Chat])],
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {}
