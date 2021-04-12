export enum ScannerType {
  Consumer,
  Checker,
}

export interface Scanner {
  id: string;
  type: ScannerType;
  carrier_id: string;
  valid_prices: number[];
}
