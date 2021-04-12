import { BaseTicket } from '../interfaces/ticket.interface';

export class PurchaseTicketDto implements BaseTicket {
  userId: string;
  quantity: number;
  price: number;
  totp: string;
}
