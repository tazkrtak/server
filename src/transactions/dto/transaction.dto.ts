import { Transaction } from '@prisma/client';

export class TransactionDto
  implements Omit<Transaction, 'user_id' | 'reference_id'> {
  id: string;
  title: string;
  created_at: Date;
  amount: number;

  static from(transaction: Transaction): TransactionDto {
    return {
      id: transaction.id,
      amount: transaction.amount,
      created_at: transaction.created_at,
      title: transaction.amount > 0 ? 'Recharge' : 'Pay for bus', // TODO: add with bus number
    };
  }
}
