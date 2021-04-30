import { Prisma, User } from '@prisma/client';

export class UserDto implements Omit<User, 'password'> {
  national_id: string;
  id: string;
  email: string;
  phone_number: string;
  full_name: string;
  credit: number;
  secret: string;
  created_at: Date;
  key: string;

  static from(user: User, key: string, secret: string): UserDto {
    return {
      id: user.id,
      national_id: user.national_id,
      created_at: user.created_at,
      email: user.email,
      phone_number: user.phone_number,
      credit: user.credit,
      full_name: user.full_name,
      secret,
      key,
    };
  }
}
