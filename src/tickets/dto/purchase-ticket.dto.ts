import { IsNumber, IsString, Length } from 'class-validator';

export class PurchaseTicketDto {
  @IsString()
  userId: string;

  @IsString()
  userKey: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @Length(6, 6)
  totp: string;
}
