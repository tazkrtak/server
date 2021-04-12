import { Module } from '@nestjs/common';
import { ScannersService } from './Scanners.service';

@Module({
  providers: [ScannersService],
})
export class ScannersModule {}
