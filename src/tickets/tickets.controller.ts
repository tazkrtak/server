import { ApiCreatedResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Body, Controller, HttpException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { ScannersService } from '../customers/scanners.service';
import { CarrierType, ScannerType, Ticket } from '@prisma/client';
import { TicketsService } from './tickets.service';
import { UsersService } from '../users/users.service';
import { CarriersService } from '../customers/carrier.service';
import { TotpService } from '../totp/totp.service';
import { ExpiredTotpException } from '../totp/exceptions/expired-totp-exception';
import { InvalidTotpException } from '../totp/exceptions/invalid-totp-exception';

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
  @ApiResponse({ description: 'Unsupported price.', status: 409 })
  @ApiResponse({ description: 'Insufficient credit.', status: 402 })
  @ApiResponse({ description: 'Invalid TOTP token.', status: 460 })
  @ApiResponse({ description: 'TOTP token has been used before.', status: 461 })
  async purchase(@Body() body: PurchaseTicketDto): Promise<Ticket> {
    // TODO: Find instead of create
    const carrier = await this.carriersService.create({
      type: CarrierType.bus,
      number: Math.floor(Math.random() * 100),
    });

    // TODO: Find instead of create
    const consumer = await this.scannerService.create(carrier.id, {
      valid_prices: [3, 5, 7],
      type: ScannerType.consumer,
    });

    if (!consumer.valid_prices.includes(body.price)) {
      throw new HttpException(
        `Unsupported price. Price must one of: ${consumer.valid_prices}`,
        409,
      );
    }

    const user = await this.usersService.findOne(body.userId);
    if (user.credit < body.price * body.quantity) {
      throw new HttpException('Insufficient credit.', 402);
    }

    try {
      await this.totpService.validate(body.totp, user, body.userKey);
    } catch (e) {
      if (e instanceof InvalidTotpException) {
        throw new HttpException('Invalid TOTP token.', 460);
      } else if (e instanceof ExpiredTotpException) {
        throw new HttpException('TOTP token has been used before.', 461);
      } else {
        throw e;
      }
    }

    const result = this.ticketsService.create(user.id, body, consumer);
    return result;
  }
}
