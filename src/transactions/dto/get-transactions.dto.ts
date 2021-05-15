import { IsDateString, IsNumber } from 'class-validator';

export class GetTransactionsDto {
  @IsNumber()
  pageNumber: number;

  @IsNumber()
  pageSize: number;

  @IsDateString()
  startDate: Date;
}
