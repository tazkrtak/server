import { IsDateString } from 'class-validator';

export class TransactionFilter {
  @IsDateString()
  startDate: Date;
}
