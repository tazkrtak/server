import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, TicketsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
