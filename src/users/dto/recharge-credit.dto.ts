import { IsNumber, IsString, Length } from 'class-validator';

export class RechargeCreditDto {
  @IsString()
  @Length(16)
  card_number: string;

  @IsString()
  expiry_month: string;

  @IsString()
  expiry_year: string;

  @IsString()
  cvv: string;

  @IsString()
  name_on_card: string;

  @IsNumber()
  recharge_amount: number;
}
