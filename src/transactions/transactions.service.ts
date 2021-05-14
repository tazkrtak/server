import { Prisma, Transaction } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    getTransactionsDto: GetTransactionsDto,
  ): Promise<Transaction[]> {
    const allTransactions = this.prisma.transaction.findMany({
      skip:
        (getTransactionsDto.pageNumber - 1) * (getTransactionsDto.pageSize - 1),
      take: getTransactionsDto.pageSize,
      where: {
        user_id: getTransactionsDto.userId,
        AND: {
          created_at: {},
        },
        created_at: {
          gt: getTransactionsDto.startDate,
          lte: new Date(Date.now()),
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return allTransactions;
  }
}
