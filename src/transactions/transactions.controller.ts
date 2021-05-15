import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtRequest } from 'src/auth/interfaces/jwt-request.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TransactionFilter } from 'src/transactions/interfaces/tranasaction-filter';
import { TransactionDto } from './dto/transaction.dto';
import { PaginationBody } from 'src/infrastructure/interfaces/pagination-body.interface';
import { PaginationResponse } from 'src/infrastructure/interfaces/pagination-response.interface';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gets all transactions' })
  async getAll(
    @Request() req: JwtRequest,
    @Body() body: PaginationBody<TransactionFilter>,
  ): Promise<PaginationResponse<TransactionDto>> {
    const { user_id } = req;

    const transactions = await this.transactionService.findAll(user_id, body);
    const total = await this.transactionService.GetTotal(
      user_id,
      body.filter.startDate,
    );

    return {
      page: body.page,
      lastPage: transactions.length != body.pageSize,
      pageSize: body.pageSize,
      total: total,
      items: transactions.map(TransactionDto.from),
    };
  }
}
