import { Injectable } from '@nestjs/common';
import { Scanner, ScannerType } from './interfaces/scanner.interface';

@Injectable()
export class ScannersService {
  registerConsumer(): Scanner {
    return {
      id: '3',
      type: ScannerType.Consumer,
      carrier_id: 'ahg35usk',
      valid_prices: [3, 5, 7],
    };
  }
}
