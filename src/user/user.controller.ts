import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUserInfoResponseDto } from './dto/GetUserInfoDto';
import { UpdateUserRequestDto } from './dto/UpdateUserDto';
import { RedisInterceptor } from 'src/redis/redis.interceptor';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @UseGuards(AuthGuard)
  handleGetUserInfo(@Request() req): Promise<GetUserInfoResponseDto> {
    const { user_id } = req.user;

    return this.userService.GetUserInfo(user_id);
  }

  @Get('/nearby')
  @UseGuards(AuthGuard)
  handleGetNearbyUsers(@Request() req) {
    const { user_id } = req.user;

    return this.userService.GetNearbyUsers(user_id);
  }

  @Patch('/')
  @UseGuards(AuthGuard)
  @UseInterceptors(RedisInterceptor)
  async handleUpdateUserInfo(
    @Body() updateUserRequest: UpdateUserRequestDto,
    @Request() req,
  ) {
    const { user_id } = req.user;

    await this.userService.UpdateUser(user_id, updateUserRequest);

    return {
      message: 'user updated successfully',
    };
  }
}
