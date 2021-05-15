import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import { Transaction } from '@prisma/client';
import { JwtRequest } from 'src/auth/interfaces/jwt-request.interface';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('transactions')
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionService: TransactionsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Gets all transactions' })
  async getAll(
    @Request() req: JwtRequest,
    @Body() getTransactionsDto: GetTransactionsDto,
  ): Promise<Transaction[]> {
    const { user_id } = req;
    return this.transactionService.findAll(user_id, getTransactionsDto);
  }
}
