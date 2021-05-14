import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { Transaction } from '@prisma/client';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @ApiOperation({ summary: 'Gets all transactions' })
  //   @ApiBadRequestResponse({ description: 'Invalid Totp token.' })
  @Get()
  async getAll(
    @Body() getTransactionsDto: GetTransactionsDto,
  ): Promise<Transaction[]> {
    return this.transactionService.findAll(getTransactionsDto);
  }
}
