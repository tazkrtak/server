import { IsDateString } from 'class-validator';

export class DateFilterDto {
  @IsDateString()
  from: Date;
}
