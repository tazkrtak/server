import crypto from 'crypto';
import { AES } from 'crypto-js';
import { Secret } from 'otpauth';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './interfaces/user.interface';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { NonUniqueException } from 'src/infrastructure/non-unique-exception';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(registerUserDto: RegisterUserDto): Promise<UserDto> {
    const secret = new Secret({ size: 16 }).b32;
    const key = crypto.randomBytes(16).toString('hex');
    const encryptedSecret = AES.encrypt(secret, key).toString();

    let user: UserDto;
    try {
      user = await this.prisma.user.create({
        data: {
          ...registerUserDto,
          secret: encryptedSecret,
        },
      });
    } catch (err) {
      throw new NonUniqueException(err);
    }
    return user;
  }

  async login(loginUserDto: LoginUserDto): Promise<UserDto> {
    const user = await this.prisma.user.findFirst({
      where: {
        id: loginUserDto.id,
        password: loginUserDto.password,
      },
    });
    if (user === null) {
      throw new NotFoundException('Incorrect user id or password.');
    }

    return user;
  }

  async findOne(id: string): Promise<UserDto> {
    const user = await this.prisma.user.findUnique({
      where: {
        id: id,
      },
    });
    return user;
  }
}
