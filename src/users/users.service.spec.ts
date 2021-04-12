import { Test } from '@nestjs/testing';
import { User } from './interfaces/user.interface';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
  });

  describe('register', () => {
    it('should return a user', async () => {
      const result: User = {
        id: '1',
        name: 'zero-based',
        secret: 'WKSFANU2PIIOF5GK',
        email: 'zerobasedteam@gmail.com',
      };

      expect(usersService.create()).toEqual(result);
    });
  });
});
