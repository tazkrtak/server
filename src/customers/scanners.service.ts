import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Scanner, Prisma } from '@prisma/client';

@Injectable()
export class ScannersService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    carrierId: string,
    input: Omit<Prisma.ScannerCreateInput, 'carrier'>,
  ): Promise<Scanner> {
    return this.prisma.scanner.create({
      data: {
        ...input,
        carrier_id: carrierId,
      },
    });
  }
}
