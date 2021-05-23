export class InvalidTotpException extends Error {
  constructor() {
    super('Invalid TOTP token');
  }
}
