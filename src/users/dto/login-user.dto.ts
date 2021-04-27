import { IsString } from 'class-validator';

export class LoginUserDto {
  @IsString()
  id: string;

  @IsString()
  password: string;
}
