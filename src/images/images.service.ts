import { Injectable } from '@nestjs/common';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/image.entity';
import { Repository } from 'typeorm';
import { Resource } from 'src/resources/entities/resource.entity';
import * as AWS from 'aws-sdk';
import { ConfigService } from "@nestjs/config";
import * as dotenv from 'dotenv';
import { VerifyImageDto } from './dto/verify-image.dto';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const configService = new ConfigService();
const AWS_S3_BUCKET_NAME = configService.get('AWS_BUCKET');
const s3 = new AWS.S3();

AWS.config.update({
  accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
  secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
  region: configService.get('AWS_DEFAULT_REGION')
});

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Resource)
    private readonly resourceRepository: Repository<Resource>,
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) { }

  async create(createImageDto: CreateImageDto) {
    const base64Image = createImageDto.url.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBuffer = Buffer.from(base64Image, 'base64');

    const uploadImage = await s3.upload({
      Bucket: AWS_S3_BUCKET_NAME,
      Key: `${Date.now().toString()} - ${createImageDto.pathDevice}`,
      Body: imageBuffer,
      ACL: 'public-read',
      ContentType: 'image/png',
    }).promise();
    const imageUrl = uploadImage.Location;

    const resource = new Resource();
    resource.type = 'image';
    const newResource = await this.resourceRepository.save(resource);

    const labelContent = await this.getTag(imageBuffer);

    const image = new Image();
    image.url = imageUrl;
    image.pathDevice = createImageDto.pathDevice;
    image.content = labelContent;
    image.resource = newResource;

    return this.imageRepository.save<CreateImageDto>(createImageDto);
  }

  findAll() {
    return this.imageRepository.find();
  }

  findOne(id: number) {
    return this.imageRepository.findOneBy({ id });
  }

  update(id: number, updateImageDto: UpdateImageDto) {
    return `This action updates a #${id} image`;
  }

  remove(id: number) {
    return this.imageRepository.delete(id);
  }

  async getTag(image: any) {
    if (!image) {
      throw new Error('Image is missing.');
    }

    const rekognition = new AWS.Rekognition({
      accessKeyId: configService.get('AWS_ACCESS_KEY_ID'),
      secretAccessKey: configService.get('AWS_SECRET_ACCESS_KEY'),
      region: configService.get('AWS_DEFAULT_REGION'),
    });

    const params = {
      Image: {
        Bytes: image.buffer,
      },
    };

    try {
      const response = await rekognition.detectModerationLabels(params).promise();
      const resultLabels = response.ModerationLabels[0].Name;
      return resultLabels;
    } catch (error) {
      console.error(error);
      throw new Error('Error detecting moderation labels.');
    }
  }
}
