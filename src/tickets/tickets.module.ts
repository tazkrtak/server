import { Module } from '@nestjs/common';

import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';
import { UsersModule } from 'src/users/users.module';
import { ScannersModule } from 'src/scanner/scanners.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [TicketsController],
  providers: [TicketsService],
  imports: [UsersModule, ScannersModule, PrismaModule],
})
export class TicketsModule {}
