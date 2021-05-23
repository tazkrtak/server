import crypto from 'crypto';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { AES, enc } from 'crypto-js';
import { Secret, TOTP } from 'otpauth';

@Injectable()
export class TotpService {
  static readonly config = {
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  };

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

  validate(totp: string, user: User, key: string): boolean {
    const secret = this.decryptSecret(key, user.secret);
    const now = Date.now();

    const delta = TOTP.validate({
      ...TotpService.config,
      window: 1,
      timestamp: now,
      secret: Secret.fromB32(secret),
      token: totp,
    });

    return delta !== null;
  }
}
