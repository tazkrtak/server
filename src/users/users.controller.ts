import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  HttpStatus,
  NotFoundException,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { LoginUserDto } from './dto/login-user.dto';
import { NonUniqueException } from '../infrastructure/non-unique-exception';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/register')
  @ApiOperation({ summary: 'Registers a new user.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The user has been successfully created.',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Unique Constraint Failed',
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Failed',
  })
  async register(@Body() registerUserDto: RegisterUserDto): Promise<UserDto> {
    const { key, secret } = this.usersService.createSecret();

    try {
      const prismaUser = await this.usersService.create(
        {
          ...registerUserDto,
          secret,
        },
        key,
      );

      return UserDto.from(prismaUser, key, secret);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new NonUniqueException((e.meta as any).target);
        }
      }
      throw e;
    }
  }

  @Post('/login')
  @ApiOperation({ summary: 'Logins a user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful log in',
    type: UserDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: `User doesn't exist`,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: `Incorrect id or password`,
  })
  @ApiResponse({
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Validation Failed',
  })
  async login(@Body() loginUserDto: LoginUserDto): Promise<UserDto> {
    const result = await this.usersService.authenticate(loginUserDto);
    if (result == null) {
      throw new NotFoundException(`User doesn't exist`);
    }

    if (!result) {
      throw new UnauthorizedException(`Incorrect National Id or Password`);
    }

    const { key, secret } = this.usersService.createSecret();
    const user = await this.usersService.refreshSecret(
      loginUserDto.national_id,
      key,
      secret,
    );
    return UserDto.from(user, key, secret);
  }
}
