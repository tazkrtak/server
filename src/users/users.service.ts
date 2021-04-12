import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  register(): User {
    return {
      id: '1',
      name: 'zero-based',
      secret: 'WKSFANU2PIIOF5GK',
      email: 'zerobasedteam@gmail.com',
    };
  }
}
