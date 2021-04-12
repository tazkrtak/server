import { Injectable } from '@nestjs/common';
import { TOTP } from '@otplib/core';
import { totp } from '@otplib/preset-default';

@Injectable()
export class TotpService extends TOTP {
  constructor() {
    super();
    this.options = {
      ...totp.options,
      step: 30,
      digits: 6,
      window: [0, 0],
    };
  }
}
