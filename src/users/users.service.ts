import { Injectable } from '@nestjs/common';
import { User } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  private readonly user: User = {
    id: '1',
    name: 'zero-based',
    secret: 'WKSFANU2PIIOF5GK',
    email: 'zerobasedteam@gmail.com',
  };

  create(): User {
    return this.user;
  }

  findOne(id: string): User {
    return this.user;
  }
}
