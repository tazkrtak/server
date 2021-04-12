import { Module } from '@nestjs/common';

import { ScannersService } from '../scanner/Scanners.service';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
@Module({
  controllers: [TicketsController],
  providers: [TicketsService, UsersService, ScannersService],
})
export class TicketsModule {}
