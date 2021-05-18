import { Module } from '@nestjs/common';

import { CarriersService } from './carrier.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ScannersService } from './scanners.service';

@Module({
  providers: [CarriersService, ScannersService],
  exports: [CarriersService, ScannersService],
  imports: [PrismaModule],
})
export class CustomersModule {}
