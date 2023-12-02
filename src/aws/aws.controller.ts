import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AwsService } from './aws.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('aws')
export class AwsController {
  constructor(private readonly awsService: AwsService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  register(
    @UploadedFile() photo: Express.Multer.File,
    ) {
    return this.awsService.uploadProfilePhotoToS3(photo.buffer);
  }
}
