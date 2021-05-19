import { Injectable } from '@nestjs/common';
import { Carrier, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CarriersService {
  constructor(private readonly prisma: PrismaService) {}

  create(input: Prisma.CarrierCreateInput): Promise<Carrier> {
    return this.prisma.carrier.create({
      data: {
        ...input,
      },
    });
  }
}
