import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Scanner, ScannerType } from './interfaces/scanner.interface';

@Injectable()
export class ScannersService {
  constructor(private readonly prisma: PrismaService) {}

  private readonly consumer: Scanner = {
    id: '3',
    type: ScannerType.Consumer,
    carrier_id: 'ahg35usk',
    valid_prices: [3, 5, 7],
  };

  findOne(id: string): Scanner {
    return this.consumer;
  }
}
