import { Body, Controller, Post } from '@nestjs/common';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post('/purchase')
  async purchase(
    @Body() purchaseTicketDto: PurchaseTicketDto,
  ): Promise<Ticket> {
    return this.ticketsService.purchase(purchaseTicketDto);
  }
}
