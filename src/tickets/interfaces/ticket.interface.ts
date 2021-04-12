import { Transaction } from '../../transactions/interfaces/transaction.interface';

export interface BaseTicket {
  userId: string;
  quantity: number;
  price: number;
}

export interface Ticket extends BaseTicket {
  id: string;
  scanned_by: string;
  scanned_at: Date;
  checked_by: string;
  checked_at: Date;
  transaction: Transaction;
}
