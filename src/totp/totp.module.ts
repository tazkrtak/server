import { Module } from '@nestjs/common';
import { TotpService } from './totp.service';

@Module({
  exports: [TotpService],
  providers: [TotpService],
})
export class TotpModule {}
