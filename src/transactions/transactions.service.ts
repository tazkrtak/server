import { Transaction } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { PaginatedQuery } from 'src/infrastructure/pagination/paginated-query';
import { PrismaService } from '../prisma/prisma.service';
import { DateFilterDto } from './dto/date-filter.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

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
}
