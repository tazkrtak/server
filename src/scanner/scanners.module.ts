import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ScannersService } from './scanners.service';

@Module({
  providers: [ScannersService],
  exports: [ScannersService],
  imports: [PrismaModule],
})
export class ScannersModule {}
