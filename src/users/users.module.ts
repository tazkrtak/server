import { Module } from '@nestjs/common';
import { TotpModule } from '../totp/totp.module';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TransactionsModule } from '../transactions/transactions.module';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
  imports: [PrismaModule, AuthModule, TransactionsModule, TotpModule],
})
export class UsersModule {}
