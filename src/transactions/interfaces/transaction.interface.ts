export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  referenceId: string;
  createdAt: Date;
}
