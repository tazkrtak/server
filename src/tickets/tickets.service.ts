import * as OTPAuth from 'otpauth';
import { BadRequestException, Injectable } from '@nestjs/common';
import { totpOptions } from '../util/totp-config';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { Transaction } from '../transactions/interfaces/transaction.interface';
import { Scanner } from '../scanner/interfaces/scanner.interface';
import { User } from '../users/interfaces/user.interface';

@Injectable()
export class TicketsService {
  create(
    purchaseTicketDto: PurchaseTicketDto,
    user: User,
    consumer: Scanner,
  ): Ticket {
    const totpAuth = new OTPAuth.TOTP({
      ...totpOptions,
      secret: OTPAuth.Secret.fromB32(user.secret),
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
      userId: user.id,
      amount: purchaseTicketDto.quantity * purchaseTicketDto.price,
      referenceId: null,
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
