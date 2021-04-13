import { Module } from '@nestjs/common';

import { ScannersService } from '../scanner/scanners.service';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports:[UsersService, ScannersService]
})
export class TicketsModule {}
