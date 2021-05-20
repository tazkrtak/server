import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Secret } from 'otpauth';
import { Prisma, User } from '@prisma/client';

import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { AES, SHA512 } from 'crypto-js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getCredit(id: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    return user.credit;
  }
}
