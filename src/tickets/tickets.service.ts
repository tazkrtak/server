import { AES, enc } from 'crypto-js';
import { TOTP, Secret } from 'otpauth';
import { Injectable } from '@nestjs/common';
import { User, Ticket, Scanner } from '@prisma/client';
import { totpOptions } from '../util/totp-config';
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
    purchaseTicketDto: PurchaseTicketDto,
    user: User,
    consumer: Scanner,
  ): Promise<Ticket> {
    const secretBytes = AES.decrypt(user.secret, purchaseTicketDto.userKey);
    const secret = secretBytes.toString(enc.Utf8);

    const totpAuth = new TOTP({
      ...totpOptions,
      secret: Secret.fromB32(secret),
    });

    const delta = totpAuth.validate({
      token: purchaseTicketDto.totp,
      window: 1,
    });

    if (delta === null) return null;

    const transaction = await this.transactionsService.create(user.id, {
      amount: -1 * purchaseTicketDto.quantity * purchaseTicketDto.price,
      created_at: new Date(Date.now()),
      reference_id: null,
    });

    return this.prisma.ticket.create({
      data: {
        user_id: user.id,
        price: purchaseTicketDto.price,
        quantity: purchaseTicketDto.quantity,
        scanned_by: consumer.id,
        transaction_id: transaction.id,
      },
    });
  }
}
