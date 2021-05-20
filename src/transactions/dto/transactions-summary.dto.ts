export class TransactionsSummaryDto {
  spent: number;
  recharged: number;

  static from(spent: number, recharged: number): TransactionsSummaryDto {
    return {
      spent,
      recharged,
    };
  }
}
