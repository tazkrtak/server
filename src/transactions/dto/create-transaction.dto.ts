import { Transaction } from '@prisma/client';

export class CreateTransactionDto
  implements Omit<Transaction, 'user_id' | 'reference_id' | 'id'> {
  title?: string;
  created_at: Date;
  amount: number;

  static from(transaction: Transaction): CreateTransactionDto {
    return {
      amount: transaction.amount,
      created_at: transaction.created_at,
      title: transaction.amount > 0 ? 'Recharge' : 'Pay for bus',
    };
  }
}
