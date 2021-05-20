import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { JwtRequest } from '../auth/interfaces/jwt-request.interface';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DateFilterDto } from './dto/date-filter.dto';
import { TransactionDto } from './dto/transaction.dto';
import {
  ApiPaginated,
  PaginatedDto,
  PaginatedQuery,
} from '../infrastructure/pagination';
import { TransactionsSummaryDto } from './dto/transactions-summary.dto';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gets transactions' })
  @ApiUnauthorizedResponse({ description: 'Invalid JWT Token' })
  @ApiPaginated(DateFilterDto, TransactionDto)
  async getAll(
    @Request() req: JwtRequest,
    @Body() query: PaginatedQuery<DateFilterDto>,
  ): Promise<PaginatedDto<TransactionDto>> {
    const { user_id } = req;

    const transactions = await this.transactionService.findAll(user_id, query);
    const total = await this.transactionService.count(user_id, query);

    return {
      page: query.page,
      page_size: query.page_size,
      is_last: transactions.length != query.page_size,
      total,
      items: transactions.map(TransactionDto.from),
    };
  }

  @Post('/summary')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gets summary of transactions' })
  @ApiUnauthorizedResponse({ description: 'Invalid JWT Token' })
  async getSummary(
    @Request() req: JwtRequest,
    @Body() filter: DateFilterDto,
  ): Promise<TransactionsSummaryDto> {
    const { user_id } = req;

    const spent = await this.transactionService.sum(user_id, filter, {
      lt: 0,
    });
    const recharged = await this.transactionService.sum(user_id, filter, {
      gt: 0,
    });

    return TransactionsSummaryDto.from(-spent, recharged);
  }
}
