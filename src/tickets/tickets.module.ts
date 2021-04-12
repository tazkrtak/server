import { Module } from '@nestjs/common';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { TotpService } from './totp.service';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService, TotpService],
})
export class TicketsModule {}
