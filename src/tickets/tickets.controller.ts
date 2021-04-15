import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Post } from '@nestjs/common';
import { ScannersService } from 'src/scanner/scanners.service';
import { UsersService } from 'src/users/users.service';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { Ticket } from './interfaces/ticket.interface';
import { TicketsService } from './tickets.service';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
    private readonly scannerService: ScannersService,
  ) {}

  @ApiOperation({ summary: 'Purchases a new ticket' })
  @ApiCreatedResponse({
    description: 'The ticket has been successfully purchased.',
  })
  @ApiBadRequestResponse({ description: 'Invalid Totp token.' })
  @Post('/purchase')
  async purchase(
    @Body() purchaseTicketDto: PurchaseTicketDto,
  ): Promise<Ticket> {
    const user = this.usersService.findOne(purchaseTicketDto.userId);
    const consumer = this.scannerService.findOne('3');
    return this.ticketsService.create(purchaseTicketDto, user, consumer);
  }
}
