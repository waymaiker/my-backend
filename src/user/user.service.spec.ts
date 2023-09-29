import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Language, SubscriptionType, UserType } from '@prisma/client';

import { data } from 'src/data';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserResponseDto } from './dtos/user.dto';
import { UserService } from './user.service';

const mockUsers = data.users;

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, {
        provide: PrismaService,
        useValue: {
          user: {
            create: jest.fn().mockReturnValue(data.users[0]),
            findMany: jest.fn().mockReturnValue([mockUsers]),
            findUniqueOrThrow: jest.fn().mockReturnValue(mockUsers.find(user => user.id == "9f904e30-8ba2-4e57-9bc3-3af0954c370e")),
            findUnique: jest.fn().mockReturnValue(null),
          },
        }
      }],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    const filters = {}

    it('should find many users with correct parameters', async () => {
      const mockPrismaFindManyUsers = jest.fn().mockReturnValue(mockUsers)
      jest.spyOn(prismaService.user, 'findMany').mockImplementation(mockPrismaFindManyUsers)

      const users:UserResponseDto[] = await service.getUsers(filters)

      expect(mockPrismaFindManyUsers).toBeCalledWith({
        where: filters,
        include: {
          followings: true,
          groups: true
        }
      })

      expect(users.length).toBeGreaterThan(1)
    })

    it('should throw NotFoundException if no user has been found', async () => {
      const mockPrismaFindManyUsers = jest.fn().mockReturnValue([])
      jest.spyOn(prismaService.user, 'findMany').mockImplementation(mockPrismaFindManyUsers)

      await expect(service.getUsers(filters)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('getUserById', () => {
    const filters = {
      id: "9f904e30-8ba2-4e57-9bc3-3af0954c370e"
    };

    it('should return one user with the corresponding Id', async () => {
      const mockUser = mockUsers.find(user => user.id == filters.id);
      const mockPrismaFindUniqueUser = jest.fn().mockReturnValue(mockUser)
      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockImplementation(mockPrismaFindUniqueUser)

      const user = await service.getUserById(filters.id)

      expect(mockPrismaFindUniqueUser).toBeCalledWith({
        where: filters,
      })

      expect(user.id).toEqual(filters.id)
    })

    it('should throw NotFoundException if no user has been found', async () => {
      const mockPrismaFindUniqueUser = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockImplementation(mockPrismaFindUniqueUser)

      await expect(service.getUserById(filters.id)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('createUser', () => {
    const body = {
      pseudo: 'PREMIUM3',
      phone: '01324354600',
      email: 'boytown23@oui.sn',
      password: 'pass<ord123',
      profile_language: Language.ENGLISH,
      scope: SubscriptionType.PREMIUM,
      user_type: UserType.ADMIN
    }

    it('should create a user', async () => {
      const userCreated = {
        email: body.email,
        phone: body.phone,
        pseudo: body.pseudo,
        profile_language: body.profile_language,
        scope: body.scope,
        user_type: body.user_type,
      }

      const module: TestingModule = await Test.createTestingModule({
        providers: [UserService, {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn().mockReturnValue(data.users[0]),
              findMany: jest.fn().mockReturnValue([mockUsers]),
              findUniqueOrThrow: jest.fn().mockReturnValue(null),
              findUnique: jest.fn().mockReturnValue(null),
            },
          }
        }],
      }).compile();

      service = module.get<UserService>(UserService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaCreateUser = jest.fn().mockReturnValue(new UserResponseDto(userCreated))
      jest.spyOn(prismaService.user, 'create').mockImplementation(mockPrismaCreateUser)

      const createdUser =  await service.createUser(body)

      expect(createdUser).toEqual(new UserResponseDto({
        email: body.email,
        phone: body.phone,
        pseudo: body.pseudo,
        profile_language: body.profile_language,
        scope: body.scope,
        user_type: body.user_type,
      }))
    })

    it('should throw ConflictException if the user email is already used', async () => {
      const mockUserAlreadyExist:object = data.users.pop();
      const mockPrismaFindUniqueUser = jest.fn().mockReturnValue(mockUserAlreadyExist)
      jest.spyOn(prismaService.user, 'findUnique').mockImplementation(mockPrismaFindUniqueUser)

      await expect(service.createUser(body)).rejects.toThrowError(new ConflictException("This email is already used"))
    })
  })

  describe('updateUserById', () => {
    const mockUserAlreadyExist:object = data.users.pop();
    const filters = {
      id: "9f904e30-8ba2-4e57-9bc3-3af0954c370e"
    };

    const body = {
      pseudo: 'Mike Bless',
    }

    it('should update the name of the user with the provided Id', async () => {
      const mockUser:object = mockUsers.find(user => user.id == filters.id);
      const mockUserUpdated:object = {
        ...mockUser,
        pseudo: body.pseudo
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [UserService, {
          provide: PrismaService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn().mockReturnValue(mockUser),
              findUnique: jest.fn().mockReturnValue(null),
              update: jest.fn().mockReturnValue(mockUserUpdated)
            },
          }
        }],
      }).compile();

      service = module.get<UserService>(UserService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaCreateUser = jest.fn().mockReturnValue(mockUserUpdated)
      jest.spyOn(prismaService.user, 'update').mockImplementation(mockPrismaCreateUser)

      const updatedUser:UserResponseDto =  await service.updateUserById(filters.id, body)

      expect(updatedUser.id).toEqual(filters.id)
      expect(updatedUser.pseudo).toEqual(body.pseudo)
    })

    it('should throw NotFoundException if no user has been found, based on the userId', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [UserService, {
          provide: PrismaService,
          useValue: {
            user: {
              findUniqueOrThrow: jest.fn().mockReturnValue(null),
              findUnique: jest.fn().mockReturnValue(null),
            },
          }
        }],
      }).compile();

      service = module.get<UserService>(UserService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaFindUniqueUser = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.user, 'findUniqueOrThrow').mockImplementation(mockPrismaFindUniqueUser)

      await expect(service.updateUserById("3e0c2835-797f-4b90-bc17-d8c9de8dc95", body)).rejects.toThrowError(NotFoundException)
    })

    it('should throw ConflictException if the pseudo already exist', async () => {
      const mockPrismaFindUniqueUser = jest.fn().mockReturnValue(mockUserAlreadyExist)
      jest.spyOn(prismaService.user, 'findUnique').mockImplementation(mockPrismaFindUniqueUser)

      await expect(service.updateUserById(filters.id, body)).rejects.toThrowError(new ConflictException("This pseudo is already used"))
    })
  })

  describe('delete', () => {
    const filters = {
      id: "0c314736-345a-46d1-a644-cab475b19e71"
    };

    it('should delete the user with the provided Id', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [UserService, {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn().mockReturnValue(data.users.filter(user => user.id == filters.id)),
              findMany: jest.fn().mockReturnValue(data.users.filter(user => user.id != "0c314736-345a-46d1-a644-cab475b19e71" )),
              delete: jest.fn().mockReturnValue(data.users.filter(user => user.id != "0c314736-345a-46d1-a644-cab475b19e71" ))
            },
          }
        }],
      }).compile();

      service = module.get<UserService>(UserService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaDeleteUser = jest.fn().mockReturnValue(data.users.filter(user => user.id != filters.id))
      jest.spyOn(prismaService.user, 'delete').mockImplementation(mockPrismaDeleteUser)

      const usersLeft:UserResponseDto[] =  await service.deleteUser(filters.id)

      expect(usersLeft.length).toEqual(data.users.length - 1)
      expect(usersLeft.filter(user => user.id == filters.id)).toEqual([])
    })

    it('should throw NotFoundException if no user has been found, based on the userId', async () => {
      const mockPrismaFindUniqueUser = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.user, 'findUnique').mockImplementation(mockPrismaFindUniqueUser)

      await expect(service.deleteUser("9f904e30-8ba2-4e57-9bc3-3af0954c370e")).rejects.toThrowError(NotFoundException)
    })
  })
});
