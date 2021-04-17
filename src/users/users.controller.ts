import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Creates a new user' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @Get('/register')
  async register(): Promise<User> {
    return this.usersService.create();
  }
}
