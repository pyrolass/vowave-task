import {
  Controller,
  Get,
  UseGuards,
  Request,
  Patch,
  Body,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { GetUserInfoResponseDto } from './dto/GetUserInfoDto';
import { UpdateUserRequestDto } from './dto/UpdateUserDto';

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
