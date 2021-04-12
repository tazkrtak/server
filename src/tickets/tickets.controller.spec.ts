import { Test } from '@nestjs/testing';
import { PurchaseTicketDto } from './dto/purchase-ticket.dto';
import { TicketsService } from './tickets.service';
import { TotpService } from './totp.service';

describe('TicketsController', () => {
  let ticketsService: TicketsService;
  let totpService: TotpService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TicketsService, TotpService],
    }).compile();
    totpService = moduleRef.get<TotpService>(TotpService);
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
