import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ScannersModule } from './scanner/scanners.module';
import { TransactionsModule } from './transactions/transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule,
    ScannersModule,
    TicketsModule,
    TransactionsModule,
    UsersModule,
  ],
})
export class AppModule {}
