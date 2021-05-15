import { Request } from 'express';

export interface JwtRequest extends Request {
  user_id: string;
}
