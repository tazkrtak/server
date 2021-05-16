import { IsDateString } from 'class-validator';

export class TransactionFilterDto {
  @IsDateString()
  startDate: Date;
}
