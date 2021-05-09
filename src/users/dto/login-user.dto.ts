import { User } from '@prisma/client';
import { IsString, Length, Matches, MinLength } from 'class-validator';

export class LoginUserDto implements Pick<User, 'national_id' | 'password'> {
  @IsString()
  @Length(14, 14, { message: 'National Id must contain exactly 14 numbers' })
  national_id: string;

  @IsString()
  @MinLength(8)
  @Matches(/.*[A-Z].*/, {
    message: 'Password must contain at least one Uppercase letter',
  })
  @Matches(/.*[a-z].*/, {
    message: 'Password must contain at least one Lowercase letter',
  })
  @Matches(/.*[0-9].*/, { message: 'Password must contain at least one digit' })
  password: string;
}
