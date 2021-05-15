import { Transaction } from '.prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginationBody } from 'src/infrastructure/interfaces/pagination-body.interface';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionFilter } from './interfaces/tranasaction-filter';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    userId: string,
    body: PaginationBody<TransactionFilter>,
  ): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      skip: (body.page - 1) * body.pageSize,
      take: body.pageSize,
      where: {
        user_id: userId,
        created_at: {
          gte: body.filter.startDate,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async GetTotal(userId: string, startDate: Date): Promise<number> {
    return this.prisma.transaction.count({
      where: {
        user_id: userId,
        created_at: {
          gte: startDate,
        },
      },
    });
  }
}
