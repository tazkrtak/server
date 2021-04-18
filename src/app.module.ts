import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ScannersModule } from './scanner/scanners.module';

@Module({
  imports: [ConfigModule.forRoot(), ScannersModule, TicketsModule, UsersModule],
})
export class AppModule {}
