import { Body, Controller, Post } from "@nestjs/common";
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
}
