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
  
  async getTranscription(FileAudio: Buffer, languageCode: string) {
    const audioName = `audio-ORIGINAL-${Date.now()}`;

    const speech = require('@google-cloud/speech');
    const client = new speech.SpeechClient();
   
    const audioBytes = FileAudio.toString('base64');
    const audio = {
      content: audioBytes,
    };

    const config = {
      encoding: 'MP3',
      sampleRateHertz: 16000,
      languageCode: 'en-US',
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

  async textToSpeech(text: string, lenguage: string, outputFile: string){
    const audioName = `audio-TRANSLATED-${Date.now()}`;

    const fs = require('fs');
    const util = require('util');
    const textToSpeech = require('@google-cloud/text-to-speech');

    // Creates a client
    const client = new textToSpeech.TextToSpeechClient();

    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'es-US', ssmlGender: 'NEUTRAL'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };

    // Performs the text-to-speech request
    // const [response] = await client.synthesizeSpeech(request);
    // // Write the binary audio content to a local file
    // const writeFile = util.promisify(fs.writeFile);
    // await writeFile('output.mp3', response.audioContent, 'binary');
    // console.log('Audio content written to file: output.mp3');

    // Make the API call to synthesize the provided text
    const [response] = await client.synthesizeSpeech(request);
    console.log('response', response);

    const { audioUrl } = await this.awsService.uploadAudioToS3(response.audioContent, audioName);

    // Write the generated audio content to the specified output file
    // fs.writeFileSync(outputFile,response.audioContent,'binary');

    // Return the output file path
    return {
      audioUrl,
    };
  }

  async translateText(text: string, target: string){
    const {Translate} = require('@google-cloud/translate').v2;
    const translate = new Translate();
    const [translation] = await translate.translate(text, target);
    return translation;
  }




}
