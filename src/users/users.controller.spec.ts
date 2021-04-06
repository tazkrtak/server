import { Test } from '@nestjs/testing';
import { User } from './interfaces/user.interface';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersController = moduleRef.get<UsersController>(UsersController);
  });

  describe('register', () => {
    it('should return a user', async () => {
      const result: User = {
        id: '1',
        name: 'zero!',
        secret: 'WKSFANU2PIIOF5GK',
        email: 'zerobasedteam@gmail.com',
      };
      expect(await usersController.register()).toBe(result);
    });
  });
});
