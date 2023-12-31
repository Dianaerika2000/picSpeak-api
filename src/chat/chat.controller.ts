import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { ApiTags } from "@nestjs/swagger";



@ApiTags('CHAT')
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
}
