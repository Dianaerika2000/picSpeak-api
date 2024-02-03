import { Controller, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
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

  @Post('verify-content')
  @UseInterceptors(FileInterceptor('image'))
  async verifyContent(@UploadedFile() image, @Res() res) {
    try {
      const result = await this.awsService.getLabelFromRekognition(image);
      return res.send({ result });
    } catch (error) {
      console.error(error);
      return res.status(500).send({ error: error.message });
    }
  }

  @Post('upload/audio')
  @UseInterceptors(FileInterceptor('audio'))
  uploadAudio(
    @UploadedFile() audio: Express.Multer.File,
    ) {
    return this.awsService.uploadAudioToS3(audio.buffer);
  }
}
