import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { WsJwtGuard } from '../guards/WsJwtGuard';

@UseGuards(WsJwtGuard)
@WebSocketGateway({
    cors: {
        origin: '*',
    },
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(
        private readonly userService: UserService,
        private readonly chatService: ChatService,
        private readonly jwtService: JwtService,
    ) { }

    async handleConnection(client: Socket) {
        const token = client.handshake.query.token as string;
        try {
            const user = await this.jwtService.verifyAsync(token);
            client.data.user = user;
            const messages = await this.chatService.getMessageHistory();
            client.emit('message_history', messages);
        } catch (error) {
            console.error('Invalid token', error);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        console.log(`User disconnected: ${client.data.user?.username}`);
        // TODO: Envoyer un message a tout le monde quand quelque se connecte/déconnecte ?
    }

    @SubscribeMessage('message')
    async handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
        const user = client.data.user;

        if (user) {
            if (!data.message || data.message.trim().length === 0) {
                return;
            }

            const savedMessage = await this.chatService.saveMessage({
                userId: user.id,
                message: data.message,
                timestamp: new Date(),
            });

            this.server.emit('message', savedMessage);
        }
    }
}
