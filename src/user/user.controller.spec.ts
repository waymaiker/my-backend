import { ConflictException, NotFoundException } from '@nestjs/common';
import { Language, SubscriptionType, UserType } from '@prisma/client';
import { Test, TestingModule } from '@nestjs/testing';

import { PrismaService } from 'src/prisma/prisma.service';
import { UserController } from './user.controller';
import { UserResponseDto } from './dtos/user.dto';
import { UserService } from './user.service';
import { data } from 'src/data';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const mockPrisma = {
      user: {
        findMany: () => Promise.resolve([]),
        findUnique: () => Promise.resolve(),
        findUniqueOrThrow: () => Promise.resolve(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService, PrismaService]
    })
    .overrideProvider(PrismaService)
    .useValue(mockPrisma)
    .compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should returns a list of items of UserResponseDto type', async () => {
      const mockGetUsersResult = data.users;
      const mockPrisma = {
        user: { findMany: () => Promise.resolve(mockGetUsersResult) },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);
      const users = await controller.getUsers();

      expect(
        users
          .map(user => user instanceof UserResponseDto)
          .every(elem => elem == true)
      ).toBeTruthy()

      expect(users).toEqual(mockGetUsersResult)
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
      const users = await controller.getUsers(UserType.USER);

      expect(users.every(user => user.user_type == UserType.USER)).toBeTruthy()
    })

    it('should throw NotFoundException if no users are found', async () => {
      await expect(
        controller.getUsers(UserType.USER)
      ).rejects.toThrowError(NotFoundException)
    })
  })

  describe('getUserById', () => {
    const filters = { id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141" };
    const mockGetUserByIdResult = new UserResponseDto(data.users.filter(user => user.id == filters.id).shift());

    it('should returns one item of UserResponseDto type', async () => {
      const mockPrisma = {
        user: { findUniqueOrThrow: () => Promise.resolve(mockGetUserByIdResult) },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);
      const user = await controller.getUserById(filters.id);

      expect(user instanceof UserResponseDto).toBeTruthy()
      expect(user).toEqual(mockGetUserByIdResult)
    })


    it('should throw NotFoundException if no users are found', async () => {
      await expect(
        controller.getUserById("")
      ).rejects.toThrowError(NotFoundException)
    })
  })

  describe('createUser', () => {
    const filters = { id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141" };
    const mockGetUserByIdResult = new UserResponseDto(data.users.filter(user => user.id == filters.id).shift());
    let body = {
      pseudo: 'PREMIUM3',
      phone: '01324354600',
      email: 'boytown23@oui.sn',
      password: 'pass<ord123',
      profile_language: Language.ENGLISH,
      scope: SubscriptionType.PREMIUM,
      user_type: UserType.ADMIN
    }

    it('creates a user', async () => {
      body = {
        pseudo: 'New User',
        phone: '01324354610',
        email: 'new@email.com',
        password: 'pass<ord123',
        profile_language: Language.ENGLISH,
        scope: SubscriptionType.PREMIUM,
        user_type: UserType.ADMIN
      }

      const mockPrisma = {
        user: {
          create: () => Promise.resolve(new UserResponseDto(body)),
          findUnique: () => Promise.resolve(),
          findUniqueOrThrow: () => Promise.resolve(),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);
      const userCreated = await controller.createUser(body);

      expect(userCreated).toBeInstanceOf(UserResponseDto)
    })

    it('should throw ConflictException if a user is found by email', async () => {
      const mockPrisma = {
        user: { findUnique: () => Promise.resolve(mockGetUserByIdResult) },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);

      await expect(
        controller.createUser(body)
      ).rejects.toThrowError(new ConflictException("This email is already used"))
    })

    it('should throw ConflictException if a user is found by pseudo', async () => {
      body.email = "new@email.com";
      mockGetUserByIdResult.email = body.email;

      const mockPrisma = {
        user: {
          findUnique: () => Promise.resolve(),
          findUniqueOrThrow: () => Promise.resolve(mockGetUserByIdResult),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);

      await expect(
        controller.createUser(body)
      ).rejects.toThrowError(new ConflictException("This pseudo is already used"))
    })
  })

  describe('updateUserById', () => {
    const filters = { id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141" };
    const mockGetUserByIdResult = new UserResponseDto(data.users.filter(user => user.id == filters.id).shift());
    let body = {
      pseudo: 'PREMIUM4',
      profile_language: Language.ENGLISH,
      scope: SubscriptionType.PREMIUM,
      finished_level: 0,
    }

    it("update a user pseudo", async () => {
      const mockExistingUser = new UserResponseDto(data.users.filter(user => user.id == filters.id).shift());
      const mockGetUserUpdated = new UserResponseDto({
        ...mockGetUserByIdResult,
        pseudo: 'PREMIUM4',
      });
      const mockPrisma = {
        user: {
          findUnique: () => Promise.resolve(),
          findUniqueOrThrow: () => Promise.resolve(mockExistingUser),
          update: () => Promise.resolve(mockGetUserUpdated),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);
      const updatedUser = await controller.updateUserById(mockExistingUser.id, body)

      expect(updatedUser).toBeInstanceOf(UserResponseDto)
      expect(updatedUser.id).toEqual(mockExistingUser.id)
      expect(updatedUser.pseudo).not.toEqual(mockExistingUser.pseudo)
    })

    it('should throw ConflictException if a user is found by the new pseudo provided', async () => {
      const mockPrisma = {
        user: {
          findUnique: () => Promise.resolve(mockGetUserByIdResult),
          findUniqueOrThrow: () => Promise.resolve(mockGetUserByIdResult)
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);

      await expect(
        controller.updateUserById(mockGetUserByIdResult.id, body)
      ).rejects.toThrowError(new ConflictException("This pseudo is already used"))
    })

    it('should throw NotFoundException if a user is found by id', async () => {
      await expect(
        controller.updateUserById("", body)
      ).rejects.toThrowError(NotFoundException)
    })
  })

  describe('deleteUser', () => {
    const filters = { id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141" };

    it("delete a user by id", async () => {
      const mockExistingUser = new UserResponseDto(data.users.filter(user => user.id == filters.id).shift());
      const mockPrisma = {
        user: {
          findUnique: () => Promise.resolve(mockExistingUser),
          findMany: () => Promise.resolve(data.users.filter(user => user.id != filters.id)),
          delete: () => Promise.resolve([]),
        },
      };

      const module: TestingModule = await Test.createTestingModule({
        controllers: [UserController],
        providers: [UserService, PrismaService]
      })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

      controller = module.get<UserController>(UserController);
      const deleteUser = await controller.deleteUser(mockExistingUser.id)

      expect(deleteUser).not.toContain(mockExistingUser)
    })

    it('should throw NotFoundException if is not found by id', async () => {
      await expect(
        controller.deleteUser("")
      ).rejects.toThrowError(NotFoundException)
    })
  })
});
