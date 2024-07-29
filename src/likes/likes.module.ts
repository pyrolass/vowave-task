import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaService } from 'src/db/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
})
export class LikesModule {}
