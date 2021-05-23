import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { LoginUserDto } from './dto/login-user.dto';
import { NonUniqueException } from '../infrastructure/non-unique-exception';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';
import { JwtRequest } from '../auth/interfaces/jwt-request.interface';
import { UserProfileDto } from './dto/user-profile.dto';
import { RechargeCreditDto } from './dto/recharge-credit.dto';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionDto } from '../transactions/dto/transaction.dto';
import { CreditDto } from './dto/credit.dto';
import { TotpService } from '../totp/totp.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly transactionsService: TransactionsService,
    private readonly totpService: TotpService,
    private readonly jwtService: JwtService,
  ) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: `Gets the user's profile.` })
  @ApiUnauthorizedResponse({ description: 'Invalid JWT Token' })
  async getProfile(@Request() req: JwtRequest): Promise<UserProfileDto> {
    const { user_id } = req;
    const user = await this.usersService.findOne(user_id);
    return UserProfileDto.from(user);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Registers a new user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Unique Constraint Failed',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Failed',
  })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
    const key = this.totpService.generateKey();
    const secret = this.totpService.generateSecret();

    try {
      const user = await this.usersService.create(
        {
          ...registerUserDto,
          secret,
        },
        key,
      );

      const payload: JwtPayload = { user_id: user.id };
      const token = this.jwtService.sign(payload);

      return UserDto.from(user, key, secret, token);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new NonUniqueException((e.meta as any).target);
        }
      }
      throw e;
    }
  }

  @Post('/login')
  @HttpCode(200)
  @ApiOperation({ summary: 'Logins a user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful log in',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `User doesn't exist`,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: `Incorrect id or password`,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Failed',
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserDto> {
    const result = await this.usersService.authenticate(loginUserDto);
    if (result == null) {
      throw new NotFoundException(`User doesn't exist`);
    }

    if (!result) {
      throw new UnauthorizedException(`Incorrect National Id or Password`);
    }

    const key = this.totpService.generateKey();
    const secret = this.totpService.generateSecret();
    const user = await this.usersService.refreshSecret(
      loginUserDto.national_id,
      key,
      secret,
    );

    const payload: JwtPayload = { user_id: user.id };
    const token = this.jwtService.sign(payload);

    return UserDto.from(user, key, secret, token);
  }

  @Post('/recharge')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Recharges the user credit.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful recharge.',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Failed',
  })
  async recharge(
    @Request() req: JwtRequest,
    @Body() rechargeCreditDto: RechargeCreditDto,
  ): Promise<TransactionDto> {
    const { user_id } = req;

    const result = await this.transactionsService.create(user_id, {
      amount: rechargeCreditDto.recharge_amount,
    });

    return TransactionDto.from(result);
  }

  @Get('/credit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: `Returns user's balance.` })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful recharge.',
    type: UserDto,
  })
  async getBalance(@Request() req: JwtRequest): Promise<CreditDto> {
    const { user_id } = req;

    const result = await this.usersService.getCredit(user_id);

    return CreditDto.from(result);
  }
}
