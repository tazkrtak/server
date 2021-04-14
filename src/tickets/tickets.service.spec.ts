import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as OTPAuth from 'otpauth';
import { totpOptions } from '../util/totp-config';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { TicketsService } from './tickets.service';
import { User } from '../users/interfaces/user.interface';
import { Scanner, ScannerType } from '../scanner/interfaces/scanner.interface';

describe('TicketsService', () => {
  let ticketsService: TicketsService;
  let user: User;
  let consumer: Scanner;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TicketsService],
    }).compile();
    ticketsService = moduleRef.get<TicketsService>(TicketsService);

    user = {
      id: '1',
      name: 'zero-based',
      secret: 'WKSFANU2PIIOF5GK',
      email: 'zerobasedteam@gmail.com',
    };

    consumer = {
      id: '3',
      type: ScannerType.Consumer,
      carrier_id: 'ahg35usk',
      valid_prices: [3, 5, 7],
    };
  });

  describe('purchase', () => {
    it('should return a ticket', async () => {
      const totpAuth = new OTPAuth.TOTP({
        ...totpOptions,
        secret: OTPAuth.Secret.fromB32(user.secret),
      });
      const generated_totp = totpAuth.generate();
      const body: PurchaseTicketDto = {
        userId: user.id,
        quantity: 2,
        price: 3,
        totp: generated_totp,
      };

      const result = ticketsService.create(body, user, consumer);
      expect(result).not.toBeNull();
    });

    it('should return exception', async () => {
      const body: PurchaseTicketDto = {
        userId: user.id,
        quantity: 2,
        price: 3,
        totp: '000000',
      };

      expect(() => ticketsService.create(body, user, consumer)).toThrow(
        BadRequestException,
      );
    });
  });
});
