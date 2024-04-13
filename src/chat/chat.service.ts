import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { Chat } from 'src/message/entities/chat.entity';
import { MessageService } from 'src/message/message.service';
import { IndividualUser } from 'src/users/entities/individual-user.entity';
import { UsersService } from 'src/users/users.service';
import { In, MoreThan, Repository } from 'typeorm';
import { OfflineMessage } from './entity/offlineMessage.entity';
import { OfflineMessageDto } from './dto/offlineMessage.dto';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(Chat)
        private readonly chatRepository: Repository<Chat>,

        private readonly userService: UsersService,

        @InjectRepository(IndividualUser) private individualRepository: Repository<IndividualUser>,
        private readonly messageService: MessageService,

        @InjectRepository(OfflineMessage)
        private readonly offlineMessageRepository: Repository<OfflineMessage>,

        private readonly GoogleCloudService: GoogleCloudService,
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
        const query = `
            SELECT * FROM public.message ms
            LEFT JOIN public.text tx on tx."messageId" = ms."id"
            LEFT JOIN public.image im on im."messageId" = ms."id"
            LEFT JOIN public.audio aud on aud."messageId" = ms."id"
            WHERE "chatId" = $1
            ORDER BY ms."created_at" ASC;
        `;

        const results = await this.chatRepository.query(query, [chatId]);
        console.log('RESULTADOS MESAJE', results)

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

    async sendMessage(createMessageDto: CreateMessageDto, receiverId: number, audioFile?: Buffer) {
        const languageOrigin = createMessageDto.resources[0]?.languageOrigin;

        if (audioFile) {
            const { transcription, audioUrl } = await this.GoogleCloudService.getTranscription(audioFile, languageOrigin);

            createMessageDto.resources[0].textOrigin = transcription;
            createMessageDto.resources[0].type = 'A';
            createMessageDto.resources[0].url = audioUrl;

            console.log('TRANSCRIPTION', transcription);
        }

        return await this.messageService.createMessage(createMessageDto, receiverId);
    }

    //consulta para traer todos los chats de un usuario
    async getAllChatsOwner(userId: number) {
        const userFound = await this.individualRepository.findOne({ where: { id: userId } });

        if (!userFound) {
            return new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        const query = `WITH chat_data AS (
            SELECT 
                chat.id as chat_id, 
                CASE 
                    WHEN chat."senderUserId" = $1 THEN chat."receivingUserId"
                    WHEN chat."receivingUserId" = $1 THEN chat."senderUserId"
                END AS other_user_id,
                CASE 
                    WHEN chat."senderUserId" = $1 THEN $1
                    ELSE chat."senderUserId"
                END AS original_user_id
            FROM 
                chat
            WHERE 
                chat."senderUserId" = $1 OR chat."receivingUserId" = $1
        ),
        last_message AS (
            SELECT 
                "message"."chatId",
                MAX("message".id) as last_message_id,
                MAX("message"."individualUserId") as last_message_senderUser,
                MAX("message".created_at) as last_message_created_at
            FROM 
                "message"
            GROUP BY 
                "message"."chatId"
        ),
        last_text AS (
            SELECT 
                text."messageId",
                text.text_origin,
                text.text_translate,
                MAX(text.created_at) as last_text_created_at
            FROM 
                text
            GROUP BY
                text."messageId", text.text_origin, text.text_translate
        ),
        user_language AS (
            SELECT 
                "language_user"."user_id",
                "language".name as matern_language
            FROM 
                "language_user"
            JOIN
                "language" ON "language_user"."language_id" = "language".id
            WHERE 
                "language_user".matern_language = true
        )
        SELECT 
            chat_data.*,
            "individualUsers".name as other_user_name,
            "individualUsers".lastname as other_user_lastname,
            "individualUsers".username as other_user_username,
            "individualUsers".photo_url as other_user_photo,
            "nacionality".name as other_user_nacionality,
            other_user_language.matern_language as other_user_matern_language,
            original_user_language.matern_language as original_user_matern_language,
            last_message.last_message_senderUser as message_user_id,
            last_message.last_message_created_at as message_datetime,
            last_text.text_origin as message_text_origin,
            last_text.text_translate as message_text_translate
        FROM 
            chat_data
        JOIN 
            "individualUsers" ON chat_data.other_user_id = "individualUsers".id
        LEFT JOIN
            "nacionality" ON "individualUsers".nacionality_id = "nacionality".id
        JOIN
            user_language as other_user_language ON chat_data.other_user_id = other_user_language."user_id"
        JOIN
            user_language as original_user_language ON chat_data.original_user_id = original_user_language."user_id"
        JOIN
            last_message ON chat_data.chat_id = last_message."chatId"
        LEFT JOIN
            last_text ON last_message.last_message_id = last_text."messageId"
        WHERE 
            last_message.last_message_created_at IS NOT NULL
            ORDER BY 
            last_message.last_message_created_at DESC;  
    `;

        const results = await this.chatRepository.query(query, [userId]);

        return results;
    }

    async getAllChatsForUser(userId: number): Promise<Chat[]> {
        const query = `
        WITH LatestMessage AS (
            SELECT
                m."chatId",
                m.id AS messageId,
                ROW_NUMBER() OVER (PARTITION BY m."chatId" ORDER BY m."created_at" DESC) AS rn
            FROM
                public."message" m
        )
        
        SELECT DISTINCT
            c.id AS chatId,
            CASE
                WHEN c."senderUserId" = $1 THEN c."receivingUserId"
                ELSE c."senderUserId"
            END AS resUserId,
            us.username AS resUserName,
            us.photo_url AS resUserPhoto,
            n.name AS resUserNation,
            tx."text_origin" AS message,
            tx."created_at" AS hora,
            lSender.name AS senderMotherLanguage,
            lReceiver.name AS receiverMotherLanguage
        FROM
            public.chat c
        INNER JOIN
            public."individualUsers" us ON us.id = CASE
                WHEN c."senderUserId" = $1 THEN c."receivingUserId"
                ELSE c."senderUserId"
            END
        LEFT JOIN
            LatestMessage lm ON lm."chatId" = c.id AND lm.rn = 1
        LEFT JOIN
            public."message" ms ON ms.id = lm.messageId
        LEFT JOIN
            public.text tx ON tx."messageId" = ms.id
        LEFT JOIN
            public.nacionality n ON n.id = us."nacionality_id"
        LEFT JOIN 
            public.language_user luSender ON luSender.user_id = c."senderUserId"
        LEFT JOIN 
            public.language_user luReceiver ON luReceiver.user_id = c."receivingUserId"
        LEFT JOIN
            public.language lSender ON lSender.id = luSender.language_id
        LEFT JOIN
            public.language lReceiver ON lReceiver.id = luReceiver.language_id
        WHERE
            c."senderUserId" = $1 OR c."receivingUserId" = $1;        
        `;

        const results = await this.chatRepository.query(query, [userId]);

        return results;
    }

    async saveOfflineMessage(offlineMessage: OfflineMessageDto) {
        const newOfflineMessage = this.offlineMessageRepository.create(offlineMessage);
        return await this.offlineMessageRepository.save(newOfflineMessage);
    }

    async getOfflineMessages(userId: number) {
        const limit = 50; // máximo a obtener

        const since = new Date();
        since.setDate(since.getDate() - 7);

        const messages = await this.offlineMessageRepository.find({
            where: {
                receiverId: userId,
                delivered: false,
                createdAt: MoreThan(since)
            },
            order: { createdAt: 'ASC' },
            take: limit
        });

        // Marcar como entregados
        await this.offlineMessageRepository.update(
            { id: In(messages.map(m => m.id)) },
            { delivered: true }
        );

        return messages;
    }
}

