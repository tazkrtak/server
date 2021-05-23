import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { ScannersService } from '../customers/scanners.service';
import { CarrierType, ScannerType, Ticket } from '@prisma/client';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
import { CarriersService } from '../customers/carrier.service';
import { TotpService } from '../totp/totp.service';

@ApiTags('tickets')
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly usersService: UsersService,
    private readonly scannerService: ScannersService,
    private readonly carriersService: CarriersService,
    private readonly totpService: TotpService,
  ) {}

  @Post('/purchase')
  @ApiOperation({ summary: 'Purchases a new ticket' })
  @ApiCreatedResponse({
    description: 'The ticket has been successfully purchased.',
  })
  @ApiBadRequestResponse({ description: 'Invalid Totp token.' })
  async purchase(@Body() body: PurchaseTicketDto): Promise<Ticket> {
    // TODO: Find instead of create
    const carrier = await this.carriersService.create({
      type: CarrierType.bus,
      number: Math.floor(Math.random() * 100),
    });

    const consumer = await this.scannerService.create(carrier.id, {
      valid_prices: [3, 5, 7],
      type: ScannerType.consumer,
    });

    const user = await this.usersService.findOne(body.userId);

    const isValid = this.totpService.validate(body.totp, user, body.userKey);
    if (!isValid) throw new BadRequestException('Invalid TOTP token.');

    const result = this.ticketsService.create(user.id, body, consumer);
    return result;
  }
}
