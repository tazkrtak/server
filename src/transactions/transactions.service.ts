import { Prisma, Transaction } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginatedQuery } from 'src/infrastructure/pagination/paginated-query';
import { PrismaService } from '../prisma/prisma.service';
import { DateFilterDto } from './dto/date-filter.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    userId: string,
    transactionCreateInput: Omit<Prisma.TransactionCreateInput, 'user'>,
  ): Promise<Transaction> {
    const [transaction] = await this.prisma.$transaction([
      this.prisma.transaction.create({
        data: {
          ...transactionCreateInput,
          user_id: userId,
        },
      }),
      this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          credit: {
            increment: transactionCreateInput.amount,
          },
        },
      }),
    ]);

    return transaction;
  }

  findAll(
    userId: string,
    query: PaginatedQuery<DateFilterDto>,
  ): Promise<Transaction[]> {
    const offset = (query.page - 1) * query.page_size;
    return this.prisma.transaction.findMany({
      skip: offset,
      take: query.page_size,
      where: {
        user_id: userId,
        created_at: {
          gte: query.filter.from,
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  count(userId: string, query: PaginatedQuery<DateFilterDto>): Promise<number> {
    return this.prisma.transaction.count({
      where: {
        user_id: userId,
        created_at: {
          gte: query.filter.from,
        },
      },
    });
  }

  async sum(
    userId: string,
    filter: DateFilterDto,
    amountFilter: Prisma.FloatFilter,
  ): Promise<number> {
    const result = await this.prisma.transaction.aggregate({
      sum: { amount: true },
      where: {
        amount: amountFilter,
        user_id: userId,
        created_at: {
          gte: filter.from,
        },
      },
    });

    return result.sum.amount;
  }
}
