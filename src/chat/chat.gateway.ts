import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
  @WebSocketServer() server: Server;
  
  constructor(
    private readonly chatService: ChatService
  ) {}
  
  handleConnection(client: Socket, ...args: any[]) {
    console.log('Cliente conectado: ', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado: ', client.id);
  }

  @SubscribeMessage('join')
  async joinRoom(client: Socket, room: string) {
    console.log('room: ', room)
    client.join(room);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: { room: string, message: string }) {
    // const message = await this.chatService.createMessage(payload);
    // this.server.emit('message', message);
    const { room, message } = payload;
    console.log('message: ', message);
    this.server.to(room).emit('message', message);
  }

  @SubscribeMessage('typing')
  async typing(client: Socket, payload: { room: string, message: string }) {
    const { room, message } = payload;
    this.server.to(room).emit('typing', message);
  }

  @SubscribeMessage('leave_chat')
  handleRoomLeave(client: Socket, room:string) {
    console.log(`chao room_${room}`)
    client.leave(room);
  }

}
