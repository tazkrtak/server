import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule, AuthModule],
})
export class UsersModule {}
