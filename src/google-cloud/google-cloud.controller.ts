import { Body, Controller, Get, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GoogleCloudService } from './google-cloud.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('google-cloud')
export class GoogleCloudController {
  constructor(private readonly googleCloudService: GoogleCloudService) {}

  @Post('transcribe')
  @UseInterceptors(FileInterceptor('audio'))
  async speechToText(
    @UploadedFile() audio: Express.Multer.File,
    ) {
    return this.googleCloudService.getTranscription(audio.buffer, 'en-US');
  }

  @Post('text-to-speech')
  async textToSpeech( @Body('text') text: string, @Body('language') language: string){
    console.log(text, language);
    return this.googleCloudService.textToSpeech(text, 'en-US');
  }

  @Get('lenguage/code')
  async getLenguageCode(@Body('language') language: string){
    return this.googleCloudService.getLenguageCodeForTextToSpeech(language);
  }  
}
