export class ExpiredTotpException extends Error {
  constructor() {
    super('Expired TOTP token');
  }
}
