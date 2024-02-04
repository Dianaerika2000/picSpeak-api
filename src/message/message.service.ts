import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { UsersService } from 'src/users/users.service';
import { ResourcesService } from 'src/resources/resources.service';
import { Chat } from './entities/chat.entity';
import { ConfigurationService } from 'src/configuration/configuration.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(Chat)
    private readonly chatRepository: Repository<Chat>,
    private individualUserService: UsersService,
    private resourceService: ResourcesService,
    private configurationService: ConfigurationService,
  ) { }

  async createMessage(createMessageDto: CreateMessageDto, receiverId: number) {
    const { userId, chatId, resources } = createMessageDto;
    console.log('Receiver Id', receiverId)

    // Obtener instancias del usuario y del chat
    const user = await this.individualUserService.findOne(userId);
    const chat = await this.chatRepository.findOneBy({ id: chatId });
    console.log('Message - Chat', chat);

    const images = resources.filter(resource => resource?.type === 'I');
    const texts = resources.filter(resource => resource?.type === 'T');
    const audios = resources.filter(resource => resource?.type === 'A');

    // Crear el mensaje
    const message = this.messageRepository.create({
      status: true,
      individualUser: user,
      chat: chat,
      createdAt: new Date(),
      updatedAt: new Date(),
      text: await Promise.all(texts.map(text => this.resourceService.createText(text))),
      image: await Promise.all(images.map(image => this.resourceService.createImage(image))),
      audio: await Promise.all(audios.map(audio => this.resourceService.createAudio(audio))),
    });
    console.log('Message - Create message', message)

    if (message.image && message.image.length > 0) {
      // Obtener el content label de la imagen
      const imageLabelContent = message.image[0].content;
      console.log(imageLabelContent)

      const content = await this.compareUserContent(receiverId, imageLabelContent);
      message.isShowing = content ? false : true;
    }

    // Guardar el mensaje en la base de datos
    return await this.messageRepository.save(message);
  }

  async compareUserContent(receiverId, contentLabelImage) {
    try {
      const inappropiateContents = await this.configurationService.getInappropriateContentUser(receiverId);
      console.log('User Content Function', inappropiateContents)

      if (Array.isArray(inappropiateContents)) {
        for (const item of inappropiateContents) {
          // Verificar si la propiedad "inappropiateContent" existe y contiene "original_name"
          if (item.inappropiateContent && item.inappropiateContent.original_name) {
            // Validar si contentLabelImage existe en la lista
            if (contentLabelImage == item.inappropiateContent.original_name)
              return true;
          }
        }
      }
      return false;
    } catch (error) {
      console.error('Error al obtener contenido inapropiado del usuario:', error);
    }
  }
}
