import { DetectModerationLabelsCommand, RekognitionClient } from '@aws-sdk/client-rekognition';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsService {
  constructor(
    private readonly configService: ConfigService,
  ) {}

  async uploadProfilePhotoToS3( profilePhotoBuffer: Buffer, faceId: string = 'default') {
    const s3Bucket = this.configService.get('AWS_BUCKET');

    // Step 1: Connects to AWS S3 service
    const s3Client = new S3Client({
      region: this.configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Step 2: Create an S3 object with the user's image
    const s3Object = await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: `user_avatar_${faceId}.jpeg`,
        Body: profilePhotoBuffer,
        ContentType: 'image/jpg',
      }),
    );
    
    const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/user_avatar_${faceId}.jpeg`;
  
    return {
      profilePhotoUrl: s3ObjectUrl,
    };
  }

  async uploadImageToS3( photoBuffer: Buffer, name: string = 'default') {

    const s3Bucket = this.configService.get('AWS_BUCKET');

    // Step 1: Connects to AWS S3 service
    const s3Client = new S3Client({
      region: this.configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Step 2: Create an S3 object with the user's image
    const s3Object = await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: `${name}.jpeg`,
        Body: photoBuffer,
        ContentType: 'image/jpeg',
      }),
    );
    
    const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/${name}.jpeg`;
  
    return {
      photoUrl: s3ObjectUrl,
    };
  }

  async getLabelFromRekognition(photoBuffer: any) {
    if (!photoBuffer) {
      throw new Error('Image is missing.');
    }

    // Connects to AWS Rekognition service
    const rekognitionClient = new RekognitionClient({
      region: this.configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    const command = new DetectModerationLabelsCommand( {
      Image: {
        Bytes: photoBuffer,
      },
    });

    try {
      const response = await rekognitionClient.send(command);
      if (response.ModerationLabels && response.ModerationLabels[0] && response.ModerationLabels[0].Name) {
        return response.ModerationLabels[0].Name;
      } else {
        return 'No tiene contenido inapropiado';
      }
    } catch (error) {
      console.error('Error de AWS REKOGNITION',error);
      throw new Error('Error detecting moderation labels.');
    }
  }

  async uploadAudioToS3( audioBuffer: Buffer, name: string = 'default') {

    const s3Bucket = this.configService.get('AWS_BUCKET');

    // Step 1: Connects to AWS S3 service
    const s3Client = new S3Client({
      region: this.configService.get('AWS_DEFAULT_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });

    // Step 2: Subir el audio a S3
    const s3Object = await s3Client.send(
      new PutObjectCommand({
        Bucket: s3Bucket,
        Key: `${name}.mp3`,
        Body: audioBuffer,
        ContentType: 'audio/mp3',
      }),
    );
    
    const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/${name}.mp3`;
  
    return {
      audioUrl: s3ObjectUrl
    };
  }
}
