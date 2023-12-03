import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly chatService: ChatService,
  ) { }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('Cliente conectado: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado: ', client.id);
  }

  /**
   * CHAT YA CREADO
   * @param client 
   * @param payload 
   */
  @SubscribeMessage('join')
  async joinChat(client: Socket, payload: { chat: string, senderUserId: number, receivingUserId: number, fondo: string }) {
    const { chat, senderUserId, receivingUserId, fondo } = payload;

    // Check if the chat already exists or create a new one
    const existingChat = await this.chatService.findExistingChat(senderUserId, receivingUserId);

    if (existingChat) {
      //Traer las conversaciones
      const messages = await this.chatService.getMessagesByChatId(existingChat.id);
      console.log('MESSAGES', messages)
      client.join(existingChat.id.toString());

      //Enviar los mensajes
      client.emit('messages', messages);
      // Optionally, you can emit an event or perform actions related to the joined chat
      this.server.to(existingChat.id.toString()).emit('userJoined', { userId: senderUserId, action: 'joined' });
    }
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: { chat: string, message: CreateMessageDto }) {
    const { chat, message } = payload;
    console.log('message: ', message);

    //Existe el chat: llamar al crear mensaje
    const messageSend = await this.chatService.sendMessage(message);

    this.server.to(chat).emit('message', messageSend);
  }

  @SubscribeMessage('typing')
  async typing(client: Socket, payload: { room: string, message: string }) {
    const { room, message } = payload;
    this.server.to(room).emit('typing', message);
  }

  @SubscribeMessage('leave_chat')
  handleRoomLeave(client: Socket, room: string) {
    console.log(`chao room_${room}`)
    client.leave(room);
  }
}
