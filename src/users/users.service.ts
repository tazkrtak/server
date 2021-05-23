import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { SHA512 } from 'crypto-js';
import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TotpService } from 'src/totp/totp.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly totpService: TotpService,
  ) {}

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
    const encryptedSecret = this.totpService.encryptSecret(key, secret);

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
    const hashedPassword = SHA512(userCreateInput.password).toString();
    const encryptedSecret = this.totpService.encryptSecret(
      key,
      userCreateInput.secret,
    );

    return this.prisma.user.create({
      data: {
        ...userCreateInput,
        password: hashedPassword,
        secret: encryptedSecret,
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
