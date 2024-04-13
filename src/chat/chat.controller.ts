import { Body, Controller, Get, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ApiTags } from "@nestjs/swagger";
import { OfflineMessageDto } from "./dto/offlineMessage.dto";
import { FileInterceptor } from "@nestjs/platform-express";

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@Body("senderUserId") senderUserId: number, @Body("receivingUserId") receivingUserId: number, fondo: string) {
    return this.chatService.createChat(senderUserId, receivingUserId, fondo);
  }

  @Get(':userId')
  async getAllChatsForUser(@Param('userId') userId: number) {
    return this.chatService.getAllChatsForUser(userId);
  }

  @Get('user/:id')
  async getChatsBySenderUserId(@Param('userId') userId: number){
    return this.chatService.getChatsBySenderUserId(userId);
  }

  @Get('users/:userId')
  async getChatUserOwner(@Param('userId') userId:number){
    return this.chatService.getAllChatsOwner(userId);
  }

  //obtener los mensajes de un chat
  @Get(':id/messages')
  async getMessagesByChatId(@Param('id') id: number) {
    return this.chatService.getMessagesByChatId(id);
  }

  @Post('offline')
  async createOfflineMessage(@Body() offlineMessage: OfflineMessageDto) {
    console.log('offlineMessage', offlineMessage);
    return this.chatService.saveOfflineMessage(offlineMessage);
  }

  @Get('offline/:userId')
  async getOfflineMessages(@Param('userId') userId: number) {
    return this.chatService.getOfflineMessages(userId);
  }

  @Post('message/audio')
  @UseInterceptors(FileInterceptor('audioFile'))
  async createAudioMessage(
    @UploadedFile() audioFile: Express.Multer.File,
    @Body() message: any
  ) {
    // return this.chatService.sendMessage(message, audioFile.buffer);
  }
}
