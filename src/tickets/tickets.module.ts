import { Module } from '@nestjs/common';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { UsersModule } from '../users/users.module';
import { ScannersModule } from '../scanner/scanners.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [UsersModule, ScannersModule, PrismaModule],
})
export class TicketsModule {}
