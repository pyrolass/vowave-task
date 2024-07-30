import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from 'src/db/prisma.service';
import { RedisService } from 'src/redis/redis.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, RedisService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
})
export class UserModule {}
