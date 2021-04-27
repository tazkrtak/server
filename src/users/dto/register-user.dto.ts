import { IsEmail, IsNumber, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @IsString()
  id: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber()
  phone_number: string;

  @IsString()
  full_name: string;

  @IsString()
  password: string;

  @IsNumber()
  credit: number;
}
