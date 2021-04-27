import crypto from 'crypto';
import { AES } from 'crypto-js';
import { Secret } from 'otpauth';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  constructor(private readonly prisma: PrismaService) {}

  create(): User {
    const secret = new Secret({ size: 16 }).b32;
    const key = crypto.randomBytes(16).toString('hex');
    const encryptedSecret = AES.encrypt(secret, key).toString();

    const user: User = {
      id: Math.random().toString(36).substring(7),
      name: 'zero-based',
      email: 'zerobasedteam@gmail.com',
      secret,
      key,
    };

    this.users.push({
      ...user,
      secret: encryptedSecret,
      key: null, // Don't save key in store
    });

    return user;
  }

  findOne(id: string): User {
    return this.users.find((u) => u.id == id);
  }
}
