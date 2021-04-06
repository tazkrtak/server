import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly users: User[] = [];

  register(): User {
    return {
      id: '1',
      name: 'zero!',
      secret: 'WKSFANU2PIIOF5GK',
      email: 'zerobasedteam@gmail.com',
    };
  }
}
