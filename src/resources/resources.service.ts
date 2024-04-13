import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateResourceDto } from './dto/create-resource.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Repository } from 'typeorm';
import { Image } from './entities/image.entity';
import { Text } from './entities/text.entity';
import { AwsService } from 'src/aws/aws.service';
import { ChatGptAiService } from 'src/chat-gpt-ai/chat-gpt-ai.service';
import { CreateTextDto } from './dto/create-text.dto';
import { GoogleCloudService } from '../google-cloud/google-cloud.service';
import { Audio } from './entities/audio.entity';

@Injectable()
export class ResourcesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,

    @InjectRepository(Text)
    private readonly textRepository: Repository<Text>,

    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,

    @InjectRepository(Audio)
    private readonly audioRepository: Repository<Audio>,

    private readonly awsService: AwsService,
    private readonly chatGptAiService: ChatGptAiService,
    private readonly googleCloudService: GoogleCloudService
  ) { }

  async create(createResourceDto: CreateResourceDto) {

    if (createResourceDto.type == 'I') {
      const base64Image = createResourceDto.pathDevice.replace(/^data:image\/[a-z]+;base64,/, '');
      const imageBuffer = Buffer.from(base64Image, 'base64');

      const key = `${Date.now().toString()}-${createResourceDto.pathDevice}`;
      const uploadImage = await this.awsService.uploadImageToS3(imageBuffer, key);
      const labels = await this.awsService.getLabelFromRekognition(imageBuffer);

      return this.imageRepository.create({
        pathDevice: uploadImage.photoUrl,
        url: uploadImage.photoUrl,
        content: labels.toString(),
      });
    } else if (createResourceDto.type == 'T') {
      const translateText = await this.chatGptAiService.getModelAnswer({
        question: createResourceDto.textOrigin,
        origin_language: createResourceDto.languageOrigin,
        target_language: createResourceDto.languageTarget
      });

      return this.textRepository.create({
        textOrigin: createResourceDto.textOrigin,
        textTranslate: translateText[0].text,
      });
    }
  }

  async createText(CreateTextDto: CreateTextDto) {
    const translateText = await this.chatGptAiService.getModelAnswer({
      question: CreateTextDto.textOrigin,
      origin_language: CreateTextDto.languageOrigin,
      target_language: CreateTextDto.languageTarget
    });
    // Limpia el texto eliminando comillas y espacios adicionales
    const cleanedTranslateText = translateText[0].text.replace(/["'\n]+/g, ' ').trim();

    const text = this.textRepository.create({
      textOrigin: CreateTextDto.textOrigin,
      textTranslate: cleanedTranslateText,
      //textTranslate: 'inapropiado',
      type: 'Text',
    });

    return await this.textRepository.save(text);
  }

  async createImage(createResourceDto: CreateResourceDto) {
    const base64Image = createResourceDto.pathDevice.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');
    const key = `${Date.now().toString()}-picspeak`;
    const uploadImage = await this.awsService.uploadImageToS3(imageBuffer, key);

    const labels = await this.awsService.getLabelFromRekognition(imageBuffer);

    const image = this.imageRepository.create({
      url: uploadImage.photoUrl,
      pathDevice: uploadImage.photoUrl,
      content: labels.toString(),
      type: 'I'
    });

    return await this.imageRepository.save(image);
  }

  async createAudio(createResourceDto: CreateResourceDto) {
    const { textOrigin, url, languageOrigin, languageTarget } = createResourceDto;

    const translateText = await this.chatGptAiService.getModelAnswer({
      question: textOrigin,
      origin_language: languageOrigin,
      target_language: languageTarget
    });
    // Limpia el texto eliminando comillas y espacios adicionales
    const cleanedTranslateText = translateText[0].text.replace(/["'\n]+/g, ' ').trim();

    const translateAudioUrl = await this.googleCloudService.textToSpeech(cleanedTranslateText, languageTarget);

    const audio = this.audioRepository.create({
      type: 'Audio',
      originalAudioUrl: url,
      translatedAudioUrl: translateAudioUrl.audioUrl,
    });

    return await this.audioRepository.save(audio);
  }

  findAll() {
    return this.resourceRepository.find();
  }

  findOne(id: number) {
    return this.resourceRepository.findOne({ where: { id } });
  }

  async remove(id: number) {
    const resourceToRemove = await this.resourceRepository.findOne({ where: { id } });

    if (!resourceToRemove) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }
    return this.resourceRepository.remove(resourceToRemove);
  }
}
