import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { ScannersModule } from './scanner/scanners.module';

@Module({
  imports: [ConfigModule.forRoot(), ScannersModule, TicketsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
