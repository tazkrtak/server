import { Prisma } from '@prisma/client';
import { IsEmail, IsPhoneNumber, IsString } from 'class-validator';
import { LoginUserDto } from './login-user.dto';

export class RegisterUserDto
  extends LoginUserDto
  implements
    Pick<Prisma.UserCreateInput, 'email' | 'phone_number' | 'full_name'> {
  @IsEmail()
  email: string;

  @IsPhoneNumber('EG')
  phone_number: string;

  @IsString()
  full_name: string;
}
