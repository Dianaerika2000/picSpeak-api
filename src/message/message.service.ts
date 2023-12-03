import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';
import { ResourcesService } from 'src/resources/resources.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    private individualUserService: UsersService,
    private chatService: ChatService,
    private resourceService: ResourcesService,
  ) { }

  async createMessage(userId: number, chatId: number, createMessageDto: CreateMessageDto): Promise<Message> {
    // Obtener instancias del usuario y del chat
    const user = await this.individualUserService.findOne(userId);
    const chat = await this.chatService.findOne(chatId);

    const resources = await Promise.all(
      createMessageDto.resources.map(resourceDto => this.resourceService.create(resourceDto))
    );

    // Crear una instancia del mensaje
    const message = this.messageRepository.create({
      status: true,
      individualUser: user,
      chat: chat,
      resources: resources,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Guardar el mensaje en la base de datos
    return await this.messageRepository.save(message);
  }

  create() {
    return 'This action create message';
  }

  findAll() {
    return `This action returns all message`;
  }

  findOne(id: number) {
    return `This action returns a #${id} message`;
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return `This action updates a #${id} message`;
  }

  remove(id: number) {
    return `This action removes a #${id} message`;
  }
}
