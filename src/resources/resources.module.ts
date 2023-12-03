import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Resource } from './entities/resource.entity';
import { AwsModule } from 'src/aws/aws.module';
import { ChatGptAiModule } from 'src/chat-gpt-ai/chat-gpt-ai.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Resource]),
    AwsModule,
    ChatGptAiModule
  ],
  controllers: [ResourcesController],
  providers: [ResourcesService],
  exports: [TypeOrmModule, ResourcesService]
})
export class ResourcesModule {}
