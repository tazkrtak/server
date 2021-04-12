import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/transactions/interfaces/transaction.interface';
import { User } from 'src/users/interfaces/user.interface';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { TotpService } from './totp.service';

@Injectable()
export class TicketsService {
  constructor(private readonly totpService: TotpService) {}
  purchase(purchaseTicketDto: PurchaseTicketDto): Ticket {
    const user: User = {
      id: purchaseTicketDto.userId,
      secret: 'WKSFANU2PIIOF5GK',
      email: 'zerobasedteam@gmail.com',
      name: 'zero-based',
    };

    const isValid = this.totpService.check(purchaseTicketDto.totp, user.secret);
    if (isValid) {
      const transaction: Transaction = {
        id: '1',
        userId: '1',
        amount: 6,
        referenceId: '3',
      };
      const ticket: Ticket = {
        id: '1',
        userId: '1',
        quantity: 2,
        price: 3,
        scanned_by: 'a3tfk13',
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
