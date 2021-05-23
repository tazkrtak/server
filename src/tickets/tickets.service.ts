import { Injectable } from '@nestjs/common';
import { Ticket, Scanner } from '@prisma/client';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async create(
    userId: string,
    purchaseTicketDto: PurchaseTicketDto,
    consumer: Scanner,
  ): Promise<Ticket> {
    const transaction = await this.transactionsService.create(userId, {
      amount: -1 * purchaseTicketDto.quantity * purchaseTicketDto.price,
      reference_id: null,
    });

    return this.prisma.ticket.create({
      data: {
        user_id: userId,
        price: purchaseTicketDto.price,
        quantity: purchaseTicketDto.quantity,
        scanned_by: consumer.id,
        transaction_id: transaction.id,
      },
    });
  }
}
