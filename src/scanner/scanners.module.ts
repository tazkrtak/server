import { Module } from '@nestjs/common';
import { ScannersService } from './scanners.service';

@Module({
  providers: [ScannersService],
})
export class ScannersModule {}
