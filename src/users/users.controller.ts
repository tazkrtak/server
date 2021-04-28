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
import { AES } from 'crypto-js';
import { sha512 } from 'js-sha512';

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
    const { key, secret } = this.usersService.createSecret();
    const encryptedSecret = AES.encrypt(secret, key).toString();
    try {
      registerUserDto.password = sha512(registerUserDto.password);
      const user = await this.usersService.create(
        registerUserDto,
        encryptedSecret,
      );
      return { ...user, key };
    } catch (err) {
      throw new NonUniqueException(err);
    }
  }

  @ApiOperation({ summary: 'Logins a user.' })
  @ApiCreatedResponse({ description: 'The user has successfully logged in.' })
  @Get('/login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserDto> {
    const { key, secret } = this.usersService.createSecret();
    const encryptedSecret = AES.encrypt(secret, key).toString();
    loginUserDto.password = sha512(loginUserDto.password);
    const prismaUser = await this.usersService.findUser(loginUserDto);
    if (prismaUser == null) {
      throw new UnauthorizedException('Incorrect user id or password.');
    }

    prismaUser.secret = encryptedSecret;
    this.usersService.update(loginUserDto.id, prismaUser);

    const { password, ...user } = prismaUser;
    return { ...user, key };
  }
}
