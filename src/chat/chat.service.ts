import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { Chat } from 'src/message/entities/chat.entity';
import { Message } from 'src/message/entities/message.entity';
import { MessageService } from 'src/message/message.service';
import { IndividualUser } from 'src/users/entities/individual-user.entity';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,
        private readonly userService: UsersService,
        private readonly messageService: MessageService,
    ) { }

    /**
     * TODO: Make process for create a chat
     */
    async createChat(senderUserId: number, receivingUserId: number, fondo: string): Promise<Chat> {
        const senderUser = await this.findUserById(senderUserId);
        const receivingUser = await this.findUserById(receivingUserId);

        if (!senderUser || !receivingUser) {
            throw new Error('Usuario no encontrado');
        }

        //Preguntar si existe un chat de a con b

        const newChat = this.chatRepository.create({
            fondo,
            senderUser,
            receivingUser,
        });

        return await this.chatRepository.save(newChat);
    }

    private async findUserById(userId: number): Promise<IndividualUser | undefined> {
        return await this.userService.findOne(userId);
    }

    async findOne(id: number) {
        return await this.chatRepository.findOne({ where: { id } });
    }

    /**
     * TODO: Get chat by user
     * @param senderUserId 
     * @returns 
     */
    async getChatsBySenderUserId(senderUserId: number): Promise<Chat[]> {
        return await this.chatRepository.find({
            where: { senderUser: { id: senderUserId } },
            relations: ['messages'],
        });
    }

    /**
     * TODO: Get messages by chat
     * @param chatId 
     * @returns 
     */
    async getMessagesByChatId(chatId: number): Promise<any[]> {
        /* const chat = await this.chatRepository.findOne({ where: { id: chatId }, relations: ['message'] });

        if (!chat) {
            throw new Error('Chat no encontrado');
        }

        return chat.messages; */

        const query = `
    SELECT * 
    FROM
    public.message ms
    LEFT JOIN public.text tx on tx."messageId" = ms."id"
	LEFT JOIN public.image im on im."messageId" = ms."id"
    WHERE "chatId" = $1
    `;

        const results = await this.chatRepository.query(query, [chatId]);

        return results;
    }

    async findExistingChat(senderUserId: number, receivingUserId: number): Promise<Chat | undefined> {
        return await this.chatRepository
            .createQueryBuilder('chat')
            .leftJoinAndSelect('chat.senderUser', 'senderUser')
            .leftJoinAndSelect('chat.receivingUser', 'receivingUser')
            .where('(senderUser.id = :senderUserId AND receivingUser.id = :receivingUserId) OR (senderUser.id = :receivingUserId AND receivingUser.id = :senderUserId)', { senderUserId, receivingUserId })
            .getOne();
    }

    async sendMessage(createMessageDto: CreateMessageDto) {
        return this.messageService.createMessage(createMessageDto);
    }
}

