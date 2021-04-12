import { BadRequestException, Injectable } from '@nestjs/common';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { Transaction } from '../transactions/interfaces/transaction.interface';
import { totp } from 'otplib';
import { Scanner } from 'src/scanner/interfaces/scanner.interface';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class TicketsService {
  constructor() {
    totp.options = {
      ...totp.options,
      digits: 6,
      step: 30,
      window: [0, 0],
    };
  }

  create(
    purchaseTicketDto: PurchaseTicketDto,
    user: User,
    consumer: Scanner,
  ): Ticket {
    const isValid = totp.check(purchaseTicketDto.totp, user.secret);

    if (!isValid) {
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
