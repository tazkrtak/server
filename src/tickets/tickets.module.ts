import { Module } from '@nestjs/common';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { UsersModule } from 'src/users/users.module';
import { ScannersModule } from 'src/scanner/scanners.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [UsersModule, ScannersModule],
})
export class TicketsModule {}
