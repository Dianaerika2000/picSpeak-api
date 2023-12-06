import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { ChatService } from 'src/chat/chat.service';
import { ResourcesService } from 'src/resources/resources.service';
import { Text } from 'src/resources/entities/text.entity';
import { Image } from 'src/resources/entities/image.entity';
import { Chat } from './entities/chat.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private individualUserService: UsersService,
    //private chatService: ChatService,
    private resourceService: ResourcesService,
  ) { }

  async createMessage(createMessageDto: CreateMessageDto) {
    console.log('LLEGA MESAGE', createMessageDto)

    const { userId, chatId, resources } = createMessageDto;

    // Obtener instancias del usuario y del chat
    const user = await this.individualUserService.findOne(userId);
    const chat = await this.chatRepository.findOneBy({id: chatId});

    const images = resources.filter(resource => resource?.type === 'I');
    const texts = resources.filter(resource => resource?.type === 'T');

    // Crear el mensaje
    const message = this.messageRepository.create({
      status: true,
      individualUser: user,
      chat: chat,
      createdAt: new Date(),
      updatedAt: new Date(),
      text: await Promise.all(texts.map(text => this.resourceService.createText(text))),
      image: await Promise.all(images.map(image => this.resourceService.createImage(image))),
    });

    console.log('SERVICE MSM', message)

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
