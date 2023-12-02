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
        ContentType: 'image/jpeg',
      }),
    );
    
    const s3ObjectUrl = `https://${s3Bucket}.s3.amazonaws.com/user_avatar_${faceId}.jpeg`;
  
    return {
      profilePhotoUrl: s3ObjectUrl,
    };
  }
}
