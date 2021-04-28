import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { Secret } from 'otpauth';
import { User } from '@prisma/client';

import { LoginUserDto } from './dto/login-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    registerUserDto: RegisterUserDto,
    encryptedSecret: string,
  ): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data: {
        ...registerUserDto,
        secret: encryptedSecret,
      },
    });

    return prismaUser;
  }

  async update(id: string, user: User) {
    await this.prisma.user.update({
      where: {
        id: id,
      },
      data: {
        ...user,
      },
    });
  }

  async findUser(loginUserDto: LoginUserDto): Promise<User> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        id: loginUserDto.id,
        password: loginUserDto.password,
      },
    });
    return prismaUser;
  }

  async findOne(id: string): Promise<User> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return prismaUser;
  }

  createSecret(): { key: string; secret: string } {
    const secret = new Secret({ size: 16 }).b32;
    const key = crypto.randomBytes(16).toString('hex');
    return { key, secret };
  }
}
