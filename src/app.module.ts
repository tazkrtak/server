import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { CustomersModule } from './customers/customers.module';
import { TicketsModule } from './tickets/tickets.module';
import { TransactionsModule } from './transactions/transactions.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // always first
    AuthModule,
    CustomersModule,
    TicketsModule,
    TransactionsModule,
    UsersModule,
  ],
})
export class AppModule {}
