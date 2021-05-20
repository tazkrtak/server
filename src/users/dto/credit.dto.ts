export class CreditDto {
  balance: number;

  static from(balance: number): CreditDto {
    return {
      balance,
    };
  }
}
