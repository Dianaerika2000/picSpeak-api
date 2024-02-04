import { Module } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';
import { GoogleCloudController } from './google-cloud.controller';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [AwsModule],
  controllers: [GoogleCloudController],
  providers: [GoogleCloudService],
  exports: [GoogleCloudService]
})
export class GoogleCloudModule {}
