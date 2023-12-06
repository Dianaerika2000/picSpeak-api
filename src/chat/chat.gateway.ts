import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Server, Socket } from 'socket.io';
import { CreateResourceDto } from 'src/resources/dto/create-resource.dto';
import { CreateMessageDto } from 'src/message/dto/create-message.dto';
import { UsersService } from 'src/users/users.service';


interface OnlineUser {
  userId: number;
  socketId: string;
}

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private userSocketsMap = {};

  constructor(
    private readonly chatService: ChatService,
    private readonly userService: UsersService,
  ) { }

  // handleConnection(client: Socket, ...args: any[]) {
  //   console.log('Cliente conectado: ', client.id);
  // }

  async handleConnection(client: Socket, ...args: any[]) {
    const userId = client.handshake.query.userId;

    const user = await this.userService.findOne(+userId);

    // Agregar al namespace
    const onlineUser: OnlineUser = {
      userId: user.id,
      socketId: client.id,
    };

    client.data.user = onlineUser;

    // Actualizar lista global
    this.userSocketsMap[onlineUser.userId] = onlineUser;

    console.log(`list of users:  ${JSON.stringify(this.userSocketsMap)}`);
  }

  // handleDisconnect(client: Socket) {
  //   console.log('Cliente desconectado: ', client.id);
  // }

  handleDisconnect(client: Socket) {
    if (client.data.user) {
      delete this.userSocketsMap[client.data.user.userId];
      console.log(`list of users actual:  ${JSON.stringify(this.userSocketsMap)}`);
    }
  }

  getReceivingUserSocket(userId: number) {
    // Encontrar el socketId mapeado
    const socketInfo = this.userSocketsMap[userId];

    if (!socketInfo) {
      // manejar error
      console.log('No existe un usuario conectado con ese id')
    }

    // Obtener el socket 
    const socket = this.server.of("/").sockets.get(socketInfo.socketId);

    if (!socket) {
      // manejar error
      console.log('Socket no encontrado')
    }

    return socket;
  }

  /**
   * INGRESAR A UN CHAT YA CREADO
   * @param client 
   * @param payload 
   */
  @SubscribeMessage('chatJoined')
  async joinChat(client: Socket, payload: { chat: string, senderUserId: number, receivingUserId: number, fondo: string }) {
    const { chat, senderUserId, receivingUserId, fondo } = payload;

    console.log('payload', payload)
    // Check if the chat already exists or create a new one
    const existingChat = await this.chatService.findExistingChat(senderUserId, receivingUserId);
    console.log('EXISTE', existingChat)

    if (existingChat) {
      //Traer las conversaciones
      const messages = await this.chatService.getMessagesByChatId(existingChat.id);
      console.log('CHATMESS', messages)

      //Enviar los mensajes
      client.emit('messagesLoaded', messages);

      // Optionally, you can emit an event or perform actions related to the joined chat
      this.server.to(existingChat.id.toString()).emit('userJoined', { userId: senderUserId, action: 'joined' });
    }
  }

  /*
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
  */

  // @SubscribeMessage('sendMessage')
  // async sendMessage(client: Socket, payload: { chat: string, message: CreateMessageDto }) {
  //   const { chat, message } = payload;
  //   console.log('message: ', message);

  //   //Existe el chat: llamar al crear mensaje
  //   const messageSend = await this.chatService.sendMessage(message);

  //   this.server.to(chat).emit('message', messageSend);
  // }

  /**
   * ENVIAR UN MENSAJE A CHAT YA CREADO
   * @param client 
   * @param payload 
   */
  @SubscribeMessage('sendMessage')
  async sendMessage(client: Socket, payload: { receivingUserId: number, message: CreateMessageDto }) {

    const { receivingUserId, message } = payload;

    // Save the message
    const savedMessage = await this.chatService.sendMessage(message);

    // Emit the message to the sender
    try {
      client.emit('newMessage', message);
      console.log('NEW MESSAGE client',message)
    } catch (error) {
      console.error('Error al emitir el mensaje al sender:', error);
    }

    // Find the socket ID of the receiving user
    const receivingUserSocket: Socket = this.getReceivingUserSocket(receivingUserId);

    // Send the message directly to the receiving user
    receivingUserSocket.emit('newMessage', savedMessage);
    console.log('NEW MESSAGE',savedMessage)
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