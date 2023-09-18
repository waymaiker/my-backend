import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionType, UserType } from '@prisma/client';
import { data } from 'src/data';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dtos/user.dto';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const mockPrisma = {
      user: { findMany: () => Promise.resolve([]) },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService]
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrisma)
    .compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should returns a list of items of UserResponseDto type', async () => {
      const mockPrisma = {
        user: { findMany: () => Promise.resolve(data.users) },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);

      const mockUsers = jest.fn().mockReturnValue(data.users);
      jest.fn().mockImplementation(mockUsers);

      const users = await controller.getUsers();

      expect(
        users
          .map(user => user instanceof UserResponseDto)
          .every(elem => elem == true)
      ).toBeTruthy()

      expect(users).toEqual(data.users)
    })

    it('should only returns users that have user_type equals to USER', async () => {
      const mockUsersWithUserTypeUser = data.users.filter(user => user.user_type == UserType.USER);
      const mockPrisma = {
        user: { findMany: () => Promise.resolve(mockUsersWithUserTypeUser) },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);
      service = module.get<UserService>(UserService);

      const mockPrismaUsers = jest.fn().mockReturnValue(mockUsersWithUserTypeUser);
      jest.spyOn(service, 'getUsers').mockImplementation(mockPrismaUsers);

      const users = await controller.getUsers(UserType.USER);

      expect(users.every(user => user.user_type == UserType.USER)).toBeTruthy()
    })

    it('should throw NotFoundException if no users are found', async () => {
      await expect(
        service.getUsers({user_type: UserType.USER})
      ).rejects.toThrowError(NotFoundException)
    })
  })
});
