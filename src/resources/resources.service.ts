import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { AwsService } from 'src/aws/aws.service';
import { ChatGptAiService } from 'src/chat-gpt-ai/chat-gpt-ai.service';
import { MessageService } from 'src/message/message.service';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    private readonly awsService: AwsService,
    private readonly chatGptAiService: ChatGptAiService,
    private readonly messageService: MessageService,
  ) { }

  async create(createResourceDto: CreateResourceDto) {
    let resource;

    if (createResourceDto.type == 'I') {
      const base64Image = createResourceDto.pathDevice.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Image, 'base64');

      const key = `${Date.now().toString()} - ${createResourceDto.pathDevice}`;
      const uploadImage = await this.awsService.uploadImageToS3(imageBuffer, key);

      const labels = await this.awsService.getLabelFromRekognition(imageBuffer);

      resource = new Image();
      resource.pathDevice = createResourceDto.pathDevice;
      resource.url = uploadImage.photoUrl;
      resource.content = labels.toString();
    } else if (createResourceDto.type == 'T') {
      //TODO: Make code for save message type text
      const translateText = await this.chatGptAiService.getModelAnswer({
        question: createResourceDto.textOrigin,
        origin_language: createResourceDto.languageOrigin,
        target_language: createResourceDto.languageTarget
      });

      console.log('response GPT', translateText);

      resource = new Text();
      resource.textOrigin = createResourceDto.textOrigin;
      resource.textTranslate = translateText[0].text;
    }

    console.log('resource', resource)

    return this.resourceRepository.save(resource);
  }

  findAll() {
    return this.resourceRepository.find();
  }

  findOne(id: number) {
    return this.resourceRepository.findOne({ where: {id} });
  }

  async remove(id: number) {
    const resourceToRemove = await this.resourceRepository.findOne({ where: {id} });

    if (!resourceToRemove) {
      throw new NotFoundException(`Resource with ID ${id} not found`);   
    }
    return this.resourceRepository.remove(resourceToRemove);
  }
}
