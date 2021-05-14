import { IsDate, IsNumber, IsString } from 'class-validator';

export class GetTransactionsDto {
  @IsString()
  userId: string;

  @IsNumber()
  pageNumber: number;

  @IsNumber()
  pageSize: number;

  @IsDate()
  startDate: Date;
}
