import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AES, enc } from 'crypto-js';
import { Secret, TOTP } from 'otpauth';
import { TransactionsService } from '../transactions/transactions.service';
import { ExpiredTotpException } from './exceptions/expired-totp-exception';
import { InvalidTotpException } from './exceptions/invalid-totp-exception';

@Injectable()
export class TotpService {
  static readonly config = {
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  };

  constructor(private readonly transactionsService: TransactionsService) {}

  generateSecret(): string {
    return new Secret({ size: 16 }).b32;
  }

  generateKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  encryptSecret(key: string, plainSecret: string): string {
    return AES.encrypt(plainSecret, key).toString();
  }

  decryptSecret(key: string, encryptedSecret: string): string {
    const secretBytes = AES.decrypt(encryptedSecret, key);
    return secretBytes.toString(enc.Utf8);
  }

  async validate(totp: string, user: User, key: string) {
    const secret = this.decryptSecret(key, user.secret);
    const now = Date.now();

    const delta = TOTP.validate({
      ...TotpService.config,
      window: 1,
      timestamp: now,
      secret: Secret.fromB32(secret),
      token: totp,
    });

    if (delta === null) {
      throw new InvalidTotpException();
    }

    // [RFC 6238]: The verifier MUST NOT accept the second attempt of the OTP
    // after the successful validation has been issued for the first OTP,
    // which ensures one-time only use of an OTP

    const lastTransaction = await this.transactionsService.findLast(user.id, {
      lt: 0,
    });

    const lastUsed = lastTransaction?.created_at?.valueOf();
    const toInterval = (timestamp: number): number => {
      return Math.floor(timestamp / 1000 / TotpService.config.period);
    };

    if (lastTransaction && toInterval(now) + delta === toInterval(lastUsed)) {
      throw new ExpiredTotpException();
    }

    console.log('ACCEPTED');
  }
}
