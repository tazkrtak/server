import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Secret } from 'otpauth';
import { Prisma, User } from '@prisma/client';

import { AES, SHA512 } from 'crypto-js';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RechargeCreditDto } from './dto/recharge-credit.dto';
import { TransactionsService } from '../transactions/transactions.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionsService: TransactionsService,
  ) {}

  createSecret(): { key: string; secret: string } {
    const key = crypto.randomBytes(16).toString('hex');
    const secret = new Secret({ size: 16 }).b32;
    return { key, secret };
  }

  async authenticate(loginUserDto: LoginUserDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        national_id: loginUserDto.national_id,
      },
    });

    if (user === null) {
      return null;
    }

    const hashedPassword = SHA512(loginUserDto.password).toString();
    return user.password === hashedPassword;
  }

  refreshSecret(id: string, key: string, secret: string): Promise<User> {
    const encryptedSecret = AES.encrypt(secret, key).toString();

    return this.prisma.user.update({
      where: {
        national_id: id,
      },
      data: {
        secret: encryptedSecret,
      },
    });
  }

  create(userCreateInput: Prisma.UserCreateInput, key: string): Promise<User> {
    const encryptedSecret = AES.encrypt(userCreateInput.secret, key).toString();
    const hashedPassword = SHA512(userCreateInput.password).toString();

    return this.prisma.user.create({
      data: {
        ...userCreateInput,
        secret: encryptedSecret,
        password: hashedPassword,
      },
    });
  }

  findOne(id: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
  }

  async updateCredit(
    rechargeCreditDto: RechargeCreditDto,
    user_id: string,
  ): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (user == null) return null;

    const newCredit = user.credit + rechargeCreditDto.recharge_amount;
    await this.transactionsService.create(user.id, {
      amount: rechargeCreditDto.recharge_amount,
      created_at: new Date(Date.now()),
      // TODO: Check ID Val
      reference_id: '123',
    });

    return this.prisma.user.update({
      where: {
        national_id: user.national_id,
      },
      data: {
        credit: newCredit,
      },
    });
  }
}
