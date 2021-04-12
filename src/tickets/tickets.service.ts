import { Injectable } from '@nestjs/common';
import { ScannersService } from '../scanner/scanners.service';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { TotpService } from './totp.service';
import { Transaction } from '../transactions/interfaces/transaction.interface';
import { UsersService } from '../users/users.service';

@Injectable()
export class TicketsService {
  constructor(
    private readonly totpService: TotpService,
    private readonly usersService: UsersService,
    private readonly scannersService: ScannersService,
  ) {}
  purchase(purchaseTicketDto: PurchaseTicketDto): Ticket {
    const user = this.usersService.register();
    const consumer = this.scannersService.registerConsumer();
    const isValid = this.totpService.check(purchaseTicketDto.totp, user.secret);
    if (isValid) {
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
    return null;
  }
}
