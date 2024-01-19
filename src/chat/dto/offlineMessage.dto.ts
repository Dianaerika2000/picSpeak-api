import { IsNumber, IsString } from 'class-validator';

export class OfflineMessageDto {
  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;

  @IsString()
  content: string;
}
