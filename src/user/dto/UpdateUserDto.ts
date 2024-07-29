import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserRequestDto {
  @IsString()
  @IsOptional()
  bio?: string;
  @IsNumber()
  @IsOptional()
  lat?: number;
  @IsNumber()
  @IsOptional()
  lon?: number;
}
