import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './interfaces/user.interface';
import { LoginUserDto } from './dto/login-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Registers a new user.' })
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
  })
  @Post('/register')
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
    const user = await this.usersService.create(registerUserDto);
    return user;
  }

  @ApiOperation({ summary: 'Logins a user.' })
  @ApiCreatedResponse({ description: 'The user has successfully logged in.' })
  @Get('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserDto> {
    const user = await this.usersService.login(loginUserDto);
    return user;
  }
}
