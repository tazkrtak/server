export class TransactionsSummaryDto {
  credit: number;
  spent: number;
  recharged: number;

  static from(
    credit: number,
    spent: number,
    recharged: number,
  ): TransactionsSummaryDto {
    return {
      credit,
      spent,
      recharged,
    };
  }
}
