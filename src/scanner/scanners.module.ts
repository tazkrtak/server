import { Module } from '@nestjs/common';
import { ScannersService } from './scanners.service';

@Module({
  providers: [ScannersService],
  exports: [ScannersService],
})
export class ScannersModule {}
