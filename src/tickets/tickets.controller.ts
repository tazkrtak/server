import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { ScannersService } from '../customers/scanners.service';
import { CarrierType, ScannerType, Ticket } from '@prisma/client';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
import { CarriersService } from 'src/customers/carrier.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
    private readonly scannerService: ScannersService,
    private readonly carriersService: CarriersService,
  ) {}

  @Post('/purchase')
  @ApiOperation({ summary: 'Purchases a new ticket' })
  @ApiCreatedResponse({
    description: 'The ticket has been successfully purchased.',
  })
  @ApiBadRequestResponse({ description: 'Invalid Totp token.' })
  async purchase(
    @Body() purchaseTicketDto: PurchaseTicketDto,
  ): Promise<Ticket> {
    // TODO: Find instead of create
    const carrier = await this.carriersService.create({
      type: CarrierType.bus,
      number: Math.floor(Math.random() * 100),
    });
    const consumer = await this.scannerService.create(carrier.id, {
      valid_prices: [3, 5, 7],
      type: ScannerType.consumer,
    });

    const user = await this.usersService.findOne(purchaseTicketDto.userId);
    const result = this.ticketsService.create(
      purchaseTicketDto,
      user,
      consumer,
    );

    if (result == null) throw new BadRequestException('Invalid TOTP token.');

    return result;
  }
}
