import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AwsService } from 'src/aws/aws.service';

process.env['GOOGLE_APPLICATION_CREDENTIALS'] = './deep-geography-382617-a7cc8545b3d3.json';

@Injectable()
export class GoogleCloudService {
  constructor(
    private readonly configService: ConfigService,
    private readonly awsService: AwsService,
  ) {}
  
  async getTranscription(FileAudio: Buffer, language: string) {
    const audioName = `audio-ORIGINAL-${Date.now()}`;
    const lenguageCode = this.getLenguageCodeSpeechToText(language);

    const speech = require('@google-cloud/speech');
    const client = new speech.SpeechClient();
   
    const audioBytes = FileAudio.toString('base64');
    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: lenguageCode,
    };

    const request = {
      audio: audio,
      config: config,
    };
  
    // Detects speech in the audio file
    const [response] = await client.recognize(request);
    const transcription = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');

    const { audioUrl } = await this.awsService.uploadAudioToS3(FileAudio, audioName);
    
    return {
      transcription,
      audioUrl,
    };
  }

  async textToSpeech(text: string, lenguage: string){
    const audioName = `audio-TRANSLATED-${Date.now()}`;
    const lenguageCode = this.getLenguageCodeForTextToSpeech(lenguage);

    const fs = require('fs');
    const util = require('util');
    const textToSpeech = require('@google-cloud/text-to-speech');

    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: lenguageCode, ssmlGender: 'FEMALE'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };

    // Make the API call to synthesize the provided text
    const [response] = await client.synthesizeSpeech(request);
    const { audioUrl } = await this.awsService.uploadAudioToS3(response.audioContent, audioName);

    return {
      audioUrl,
    };
  }

  
  getLenguageCodeForTextToSpeech(lenguage: string) {
    //mapa de idiomas
    const languages = {
      'inglés': 'en-US',
      'español': 'es-US',
      'francés': 'fr-FR',
      'alemán': 'de-DE',
      'italiano': 'it-IT',
      'portugués': 'pt-BR',
      'japonés': 'ja-JP',
      'chino': 'zh-CN',
      'coreano': 'ko-KR',
      'ruso': 'ru-RU',
      'árabe': 'ar-SA',
      'hebreo': 'he-IL',
      'turco': 'tr-TR',
      'hindi': 'hi-IN',
      'filipino': 'fil-PH',
    };

    return languages[lenguage.toLocaleLowerCase()];
  }

  getLenguageCodeSpeechToText(lenguage: string) {
    //mapa de idiomas
    const languages = {
      'inglés': 'en-US',
      'español': 'es-ES',
      'francés': 'fr-FR',
      'alemán': 'de-DE',
      'italiano': 'it-IT',
      'portugués': 'pt-BR',
      'japonés': 'ja-JP',
      'chino': 'zh-CN',
      'coreano': 'ko-KR',
      'ruso': 'ru-RU',
      'árabe': 'ar-SA',
      'hebreo': 'he-IL',
      'turco': 'tr-TR',
      'hindi': 'hi-IN',
      'filipino': 'fil-PH',
    };

    return languages[lenguage.toLocaleLowerCase()];
  }

  async translateText(text: string, target: string){
    const {Translate} = require('@google-cloud/translate').v2;
    const translate = new Translate();
    const [translation] = await translate.translate(text, target);
    return translation;
  }




}
