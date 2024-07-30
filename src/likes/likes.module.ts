import { Module } from '@nestjs/common';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { PrismaService } from 'src/db/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { NotificationGateway } from 'src/notification.gateway';

@Module({
  controllers: [LikesController],
  providers: [LikesService, PrismaService, NotificationGateway],
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30d' },
    }),
  ],
})
export class LikesModule {}
