import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @IsNotEmpty()
  username: string;
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
  @IsNumber()
  @IsNotEmpty()
  lat: number;
  @IsNumber()
  @IsNotEmpty()
  lon: number;
}

export class SignUpResponseDto {
  @IsNumber()
  user_id: number;

  @IsString()
  username: string;

  @IsString()
  token: string;
}
