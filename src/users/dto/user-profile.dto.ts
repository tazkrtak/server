import { User } from '@prisma/client';

export class UserProfileDto
  implements
    Pick<User, 'national_id' | 'full_name' | 'email' | 'phone_number'> {
  national_id: string;
  full_name: string;
  email: string;
  phone_number: string;

  static from(user: User): UserProfileDto {
    return {
      national_id: user.national_id,
      email: user.email,
      phone_number: user.phone_number,
      full_name: user.full_name,
    };
  }
}
