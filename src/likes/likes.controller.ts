import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LikesService } from './likes.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { LikeUserDto } from './dto/LikeUserDto';

@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post('/handle_like')
  @UseGuards(AuthGuard)
  async handleLikeUser(@Body() likeRequest: LikeUserDto, @Request() req) {
    const { user_id } = req.user;

    await this.likesService.likeUser(likeRequest, user_id);

    return {
      message: 'user liked successfully',
    };
  }
}
