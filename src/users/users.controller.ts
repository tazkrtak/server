import { AES, SHA512 } from 'crypto-js';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { LoginUserDto } from './dto/login-user.dto';
import { NonUniqueException } from '../infrastructure/non-unique-exception';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

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
    const { currentKey, currentSecret } = this.usersService.createSecret();
    const encryptedSecret = AES.encrypt(currentSecret, currentKey).toString();
    try {
      registerUserDto.password = SHA512(registerUserDto.password).toString();
      const prismaUser = await this.usersService.create(
        registerUserDto,
        encryptedSecret,
      );
      const { secret, ...user } = prismaUser;
      return { ...user, secret: currentSecret, key: currentKey };
    } catch (err) {
      throw new NonUniqueException(err);
    }
  }

  @ApiOperation({ summary: 'Logins a user.' })
  @ApiCreatedResponse({ description: 'The user has successfully logged in.' })
  @Get('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserDto> {
    const { currentKey, currentSecret } = this.usersService.createSecret();
    const encryptedSecret = AES.encrypt(currentSecret, currentKey).toString();
    loginUserDto.password = SHA512(loginUserDto.password).toString();
    const prismaUser = await this.usersService.findUser(loginUserDto);
    if (prismaUser == null) {
      throw new UnauthorizedException('Incorrect id or password.');
    }

    prismaUser.secret = encryptedSecret;
    this.usersService.update(loginUserDto.id, prismaUser);

    const { password, secret, ...user } = prismaUser;
    return { ...user, secret: currentSecret, key: currentKey };
  }
}
