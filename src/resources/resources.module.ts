import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { Image } from './entities/image.entity';
import { Text } from './entities/text.entity';
import { AwsModule } from 'src/aws/aws.module';
import { ChatGptAiModule } from 'src/chat-gpt-ai/chat-gpt-ai.module';
import { GoogleCloudModule } from 'src/google-cloud/google-cloud.module';
import { Audio } from './entities/audio.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource, Text, Image, Audio]),
    AwsModule,
    ChatGptAiModule,
    GoogleCloudModule,
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [TypeOrmModule, ResourcesService]
})
export class ResourcesModule {}
