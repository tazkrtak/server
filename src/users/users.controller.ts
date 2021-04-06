import { Controller, Get } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/register')
  async register(): Promise<User> {
    return this.usersService.register();
  }
}
