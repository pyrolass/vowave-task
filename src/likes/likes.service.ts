import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/db/prisma.service';
import { LikeUserDto } from './dto/LikeUserDto';

@Injectable()
export class LikesService {
  constructor(private prisma: PrismaService) {}

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

    return this.prisma.likes.create({
      data: {
        liked_by: user_id,
        user_id: likeRequest.liked_user_id,
      },
    });
  }

  async unlikeUser() {}
}
