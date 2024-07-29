import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/db/prisma.service';
import { GetUserInfoResponseDto } from './dto/GetUserInfoDto';
import { UpdateUserRequestDto } from './dto/UpdateUserDto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async GetUserInfo(user_id: number): Promise<GetUserInfoResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { user_id: user_id },
      select: {
        user_id: true,
        username: true,
        lat: true,
        lon: true,
        bio: true,
      },
    });

    if (!user) {
      throw new HttpException('no user found ', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async UpdateUser(user_id: number, updateUserRequest: UpdateUserRequestDto) {
    return this.prisma.user.update({
      where: { user_id: user_id },
      data: updateUserRequest,
    });
  }

  async GetNearbyUsers(user_id: number) {
    const currentUser = await this.prisma.user.findFirst({
      where: { user_id: user_id },
    });

    const users = await this.prisma.user.findMany({
      where: { deleted: false, user_id: { not: user_id } },
      select: {
        user_id: true,
        username: true,
        bio: true,
        lat: true,
        lon: true,
      },
    });

    const usersWithDistance = users.map((user) => ({
      ...user,
      distance: this.calculateDistance(
        currentUser.lat,
        currentUser.lon,
        user.lat,
        user.lon,
      ),
    }));

    return usersWithDistance.sort((a, b) => a.distance - b.distance);
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371;
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
