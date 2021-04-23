import { IsNumber, IsString, Length } from 'class-validator';
import { BaseTicket } from '../interfaces/ticket.interface';

export class PurchaseTicketDto implements BaseTicket {
  @IsString()
  userId: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;

  @Length(6, 6)
  totp: string;
}
