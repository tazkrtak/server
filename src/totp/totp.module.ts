import { Module } from '@nestjs/common';
import { TransactionsModule } from '../transactions/transactions.module';
import { TotpService } from './totp.service';

@Module({
  imports: [TransactionsModule],
  exports: [TotpService],
  providers: [TotpService],
})
export class TotpModule {}
