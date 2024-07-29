import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignInRequestDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class SignInResponseDto {
  @IsNumber()
  user_id: number;

  @IsString()
  username: string;

  @IsString()
  token: string;
}
