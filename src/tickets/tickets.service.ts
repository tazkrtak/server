import { AES, enc } from 'crypto-js';
import { TOTP, Secret } from 'otpauth';
import { BadRequestException, Injectable } from '@nestjs/common';
import { totpOptions } from '../util/totp-config';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { Scanner } from '../scanner/interfaces/scanner.interface';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '.prisma/client';
import { Transaction } from '@prisma/client';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  create(
    purchaseTicketDto: PurchaseTicketDto,
    user: User,
    consumer: Scanner,
  ): Ticket {
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

    if (delta === null) {
      throw new BadRequestException('Invalid Totp token.');
    }

    const transaction: Transaction = {
      id: '1',
      user_id: user.id,
      amount: purchaseTicketDto.quantity * purchaseTicketDto.price,
      reference_id: null,
      created_at: new Date(Date.now()),
    };

    const ticket: Ticket = {
      id: '1',
      userId: user.id,
      quantity: purchaseTicketDto.quantity,
      price: purchaseTicketDto.price,
      scanned_by: consumer.id,
      scanned_at: new Date(Date.now()),
      checked_by: null,
      checked_at: null,
      transaction: transaction,
    };

    return ticket;
  }
}
