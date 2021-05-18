import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Scanner, Prisma } from '@prisma/client';

@Injectable()
export class ScannersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    carrierId: string,
    scannerCreateInput: Omit<Prisma.ScannerCreateInput, 'carrier'>,
  ): Promise<Scanner> {
    return this.prisma.scanner.create({
      data: {
        ...scannerCreateInput,
        carrier_id: carrierId,
      },
    });
  }
}
