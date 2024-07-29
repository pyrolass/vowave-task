import { IsNotEmpty, IsNumber } from 'class-validator';

export class LikeUserDto {
  @IsNumber()
  @IsNotEmpty()
  liked_user_id: number;
}
