import { Test } from '@nestjs/testing';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { ScannersService } from '../scanner/scanners.service';
import { TicketsService } from './tickets.service';
import { TotpService } from './totp.service';
import { UsersService } from '../users/users.service';

describe('TicketsController', () => {
  let ticketsService: TicketsService;
  let totpService: TotpService;
  let usersService: UsersService;
  let scannersService: ScannersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TicketsService, TotpService, UsersService, ScannersService],
    }).compile();
    totpService = moduleRef.get<TotpService>(TotpService);
    usersService = moduleRef.get<UsersService>(UsersService);
    scannersService = moduleRef.get<ScannersService>(ScannersService);
    ticketsService = moduleRef.get<TicketsService>(TicketsService);
  });

  describe('purchase', () => {
    it('should return a ticket', async () => {
      const totp = totpService.generate('WKSFANU2PIIOF5GK');
      const body: PurchaseTicketDto = {
        userId: '1',
        quantity: 2,
        price: 3,
        totp: totp,
      };
      const result = ticketsService.purchase(body);

      expect(result).not.toBeNull();
    });
  });
});
