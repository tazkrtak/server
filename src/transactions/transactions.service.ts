import { Prisma, Transaction } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    getTransactionsDto: GetTransactionsDto,
  ): Promise<Transaction[]> {
    const allTransactions = this.prisma.transaction.findMany({
      skip: (getTransactionsDto.pageNumber - 1) * getTransactionsDto.pageSize,
      take: getTransactionsDto.pageSize,
      where: {
        user_id: userId,
        created_at: {
          gte: getTransactionsDto.startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
    return allTransactions;
  }
}
