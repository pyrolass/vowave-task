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
}
