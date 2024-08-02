import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { LikeUserDto } from './dto/LikeUserDto';
import { NotificationGateway } from 'src/notification.gateway';

@Injectable()
export class LikesService {
  constructor(
    private prisma: PrismaService,
    private notificationGateway: NotificationGateway,
  ) {}

  async likeUser(likeRequest: LikeUserDto, user_id: number) {
    const like = await this.prisma.likes.findFirst({
      where: {
        liked_by: user_id,
        user_id: likeRequest.liked_user_id,
      },
    });

    if (like) {
      return this.prisma.likes.delete({
        where: {
          liked_by_user_id: {
            liked_by: user_id,
            user_id: likeRequest.liked_user_id,
          },
        },
      });
    }

    this.notificationGateway.sendLikeNotification(
      likeRequest.liked_user_id.toString(),
      user_id.toString(),
    );

    return this.prisma.likes.create({
      data: {
        liked_by: user_id,
        user_id: likeRequest.liked_user_id,
      },
    });
  }
}
