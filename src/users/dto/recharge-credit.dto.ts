import { IsCreditCard, IsPositive, IsString, Length } from 'class-validator';

export class RechargeCreditDto {
  @IsCreditCard()
  card_number: string;

  @IsString()
  @Length(2, 2, { message: 'Expiry month must contain exactly 2 numbers' })
  expiry_month: string;

  @Length(2, 2, { message: 'Expiry year must contain exactly 2 numbers' })
  expiry_year: string;

  @Length(3, 3, { message: 'cvv must contain exactly 3 numbers' })
  cvv: string;

  @IsString()
  name_on_card: string;

  @IsPositive()
  recharge_amount: number;
}
