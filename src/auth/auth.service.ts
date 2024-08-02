import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SignInRequestDto, SignInResponseDto } from './dto/SignInDto';
import { SignUpRequestDto, SignUpResponseDto } from './dto/SIgnUpDto';
import { PrismaService } from 'src/db/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInRequestDto: SignInRequestDto): Promise<SignInResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        email: signInRequestDto.email,
      },
    });

    if (!user) {
      throw new HttpException(
        'invalid email or password',
        HttpStatus.NOT_FOUND,
      );
    }

    const validPassword = await bcrypt.compare(
      signInRequestDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new HttpException(
        'invalid email or password',
        HttpStatus.FORBIDDEN,
      );
    }

    const token = this.jwtService.sign({
      user_id: user.user_id,
      username: user.username,
      lat: user.lat,
      lon: user.lon,
    });

    return {
      user_id: user.user_id,
      username: user.username,
      token: token,
    };
  }

  async signUp(signUpRequestDto: SignUpRequestDto): Promise<SignUpResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { username: signUpRequestDto.username },
          { email: signUpRequestDto.email },
        ],
      },
    });

    if (user) {
      throw new HttpException('user already exists', HttpStatus.FORBIDDEN);
    }

    const hashedPassword = await bcrypt.hash(signUpRequestDto.password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        username: signUpRequestDto.username,
        password: hashedPassword,
        email: signUpRequestDto.email,
        lat: signUpRequestDto.lat,
        lon: signUpRequestDto.lon,
      },
    });

    const token = this.jwtService.sign({
      user_id: newUser.user_id,
      username: newUser.username,
      lat: newUser.lat,
      lon: newUser.lon,
    });

    return {
      user_id: newUser.user_id,
      username: newUser.username,
      token: token,
    };
  }

  getRandomLatLon() {
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lon = (Math.random() * 360 - 180).toFixed(6);
    return { lat, lon };
  }

  async seed() {
    const users = [];

    for (let i = 1; i <= 20; i++) {
      const { lat, lon } = this.getRandomLatLon();
      users.push({
        username: `user${i}`,
        email: `user${i}@example.com`,
        password: '12345678',
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      });
    }
    for (const user of users) {
      try {
        await this.signUp(user);
        console.log(`User ${user.username} `);
      } catch (error) {
        console.error(`Failed to add user ${user.username}:`, error.message);
      }
    }
    return { message: 'seed completed' };
  }
}
