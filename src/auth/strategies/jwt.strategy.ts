import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // Delegates the responsibility of ensuring that a JWT has not expired to the Passport module.
      secretOrKey: configService.get('JWT_SECRET'),
    } as StrategyOptions);
  }

  async validate(payload: JwtPayload): Promise<string> {
    return payload.user_id;
  }
}
