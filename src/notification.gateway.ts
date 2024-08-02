import { JwtService } from '@nestjs/jwt';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3001', // Your client's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
})
export class NotificationGateway {
  constructor(private jwtService: JwtService) {}

  @WebSocketServer()
  server: Server;

  private userSockets = {};

  async handleConnection(client: Socket) {
    try {
      const userId = await this.getUserIdFromJWT(client);

      if (userId) {
        this.userSockets[userId] = client;

        console.log(
          `User ${userId} connected and registered for notifications`,
        );
      }
    } catch (error) {
      console.error('Error during WebSocket connection:', error.message);
      client.emit('error', 'Authentication failed');
      client.disconnect();
    }
  }

  async handleDisconnect(client: Socket) {
    const userId = await this.getUserIdFromJWT(client);
    if (userId) {
      const socketUser = this.getUserFromSocket(userId);
      if (socketUser) {
        this.userSockets[userId].disconnect();
        delete this.userSockets[userId];
        console.log(
          `User ${userId} disconnected and unregistered from notifications`,
        );
      }
    }
  }

  sendLikeNotification(liked_user_id: string, liking_user_id: string) {
    const userSocket = this.userSockets[liked_user_id];

    if (userSocket) {
      userSocket.emit('like_notification', {
        message: `User ${liking_user_id} liked your account!`,
        liking_user_id,
      });
    }
  }

  private getUserFromSocket(userId: string) {
    return this.userSockets[userId];
  }

  private async getUserIdFromJWT(client: Socket): Promise<string> {
    const [type, token] =
      client.handshake.headers.authorization?.split(' ') ?? [];

    if (type != 'Bearer' || !token) {
      client.emit('error', 'Authentication failed');
      client.disconnect();
    }

    try {
      const payload = await this.jwtService.verifyAsync(token);
      return payload.user_id;
    } catch (error) {
      console.error('Error during WebSocket jwt:', error.message);
      client.emit('error', 'Authentication failed');
      client.disconnect();
    }
  }
}
