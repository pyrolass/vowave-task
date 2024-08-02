import { Body, Controller, Post } from '@nestjs/common';
import { SignInRequestDto } from './dto/SignInDto';
import { AuthService } from './auth.service';
import { SignUpRequestDto } from './dto/SIgnUpDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/sign_in')
  handleSignIn(@Body() signInRequestDto: SignInRequestDto) {
    return this.authService.signIn(signInRequestDto);
  }

  @Post('/sign_up')
  handleSignUp(@Body() signUpRequestDto: SignUpRequestDto) {
    return this.authService.signUp(signUpRequestDto);
  }

  @Post('/seed')
  handleSeed() {
    return this.authService.seed();
  }
}
