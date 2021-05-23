import { Module } from '@nestjs/common';
import { CustomersModule } from '../customers/customers.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { UsersModule } from '../users/users.module';
import { TotpModule } from '../totp/totp.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [
    UsersModule,
    PrismaModule,
    TransactionsModule,
    CustomersModule,
    TotpModule,
  ],
})
export class TicketsModule {}
