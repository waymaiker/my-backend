import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { data } from 'src/data';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupResponseDto } from './dto/group.dto';
import { GroupService } from './group.service';

const mockGroups = data.groups.find(group => group.is_public == false)
const mockGroup = data.groups.find(group => group.id == 1)
const mockCreatedGroup = {
  id: 1,
  creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  name: "Mon Group Test",
  description: "Apprends le wolof en 1 an avec la Wolof academy",
  is_public: false,
  restricted_access: true,
  created_at: new Date(),
  updated_at: new Date(),
}

const mockAdmin = {
  group_id: 1,
  user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  assigned_at: new Date(),
  assigned_by: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f"
}

const mockGroupWithAdmin = {
  id: 1,
  creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  name: "Mon Group Test",
  description: "Apprends le wolof en 1 an avec la Wolof academy",
  is_public: false,
  restricted_access: true,
  created_at: new Date(),
  updated_at: new Date(),
  admins: [
    mockAdmin
  ]
}

// const mockAdminsGroup = [];
// const mockFollowersGroup = [];

describe('GroupService', () => {
  let service: GroupService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GroupService, {
        provide: PrismaService,
        useValue: {
          group: {
            findMany: jest.fn().mockReturnValue([mockGroups]),
            findUnique: jest.fn().mockReturnValue(mockGroup),
            create: jest.fn().mockReturnValue(mockCreatedGroup),
            findFirst: jest.fn().mockReturnValue(null)
          },
          adminsGroup: {
            create: jest.fn().mockReturnValue([mockAdmin]),
          },
          // followersGroup: {
          //   createMany: jest.fn().mockReturnValue(),
          // }
        }
      }],
    }).compile();

    service = module.get<GroupService>(GroupService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getGroups', () => {
    const filters = {
      is_public: false
    };

    it('should find many groups with correct parameters', async () => {
      const mockPrismaFindManyGroups = jest.fn().mockReturnValue([mockGroups])
      jest.spyOn(prismaService.group, 'findMany').mockImplementation(mockPrismaFindManyGroups)

      await service.getGroups(filters)

      expect(mockPrismaFindManyGroups).toBeCalledWith({
        where: filters,
        include: {
          followers: true,
          admins: true
        }
      })
    })

    it('should find many groups with correct parameters', async () => {
      const mockPrismaFindManyGroups = jest.fn().mockReturnValue([mockGroups])
      jest.spyOn(prismaService.group, 'findMany').mockImplementation(mockPrismaFindManyGroups)

      await service.getGroups(filters)

      expect(mockPrismaFindManyGroups).toBeCalledWith({
        where: filters,
        include: {
          followers: true,
          admins: true
        }
      })
    })

    it('should throw NoFoundException if no group has been found', async () => {
      const mockPrismaFindManyGroups = jest.fn().mockReturnValue([])
      jest.spyOn(prismaService.group, 'findMany').mockImplementation(mockPrismaFindManyGroups)

      await expect(service.getGroups(filters)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('getGroupById', () => {
    const filters = {
      id: 1
    };

    it('should return one group with the corresponding Id', async () => {
      const mockPrismaFindUniqueGroup = jest.fn().mockReturnValue(mockGroup)
      jest.spyOn(prismaService.group, 'findUnique').mockImplementation(mockPrismaFindUniqueGroup)

      await service.getGroupById(filters)

      expect(mockPrismaFindUniqueGroup).toBeCalledWith({
        where: filters,
        include: {
          followers: true,
          admins: true
        }
      })
    })

    it('should throw NoFoundException if no group has been found', async () => {
      const mockPrismaFindUniqueGroup = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.group, 'findUnique').mockImplementation(mockPrismaFindUniqueGroup)

      await expect(service.getGroupById(filters)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('createGroup', () => {
    const body = {
      name: "Mon Group Test",
      description: "Apprends le wolof en 1 an avec la Wolof academy",
    };

    const user = {
      name: "Jesus",
      id: "653c7602-adae-4bca-b11b-6f3cd341f663",
      iat: 0,
      exp: 0
    }

    it('should create a group', async () => {
      const mockPrismaCreateGroup = jest.fn().mockReturnValue(mockCreatedGroup)
      const mockPrismaCreateGroupAdmin = jest.fn().mockReturnValue(mockCreatedGroup)

      jest.spyOn(prismaService.group, 'create').mockImplementation(mockPrismaCreateGroup)
      jest.spyOn(prismaService.adminsGroup, 'create').mockImplementation(mockPrismaCreateGroupAdmin)

      const createdGroup =  await service.createGroup(body, user)

      expect(mockPrismaCreateGroup).toBeCalledWith({
        data: {
          name: body.name,
          description: body.description,
          creator_id: user.id
        }
      })

      expect(mockPrismaCreateGroupAdmin).toBeCalledWith({
        data: {
          group_id: createdGroup.id,
          user_id: mockAdmin.user_id,
          assigned_by: user.id,
        }
      })

      expect(createdGroup).toEqual(new GroupResponseDto(mockCreatedGroup))
    })

    it('should throw ConflictException if the group name is already used', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [GroupService, {
          provide: PrismaService,
          useValue: {
            group: {
              create: jest.fn().mockReturnValue(mockCreatedGroup),
              findFirst: jest.fn().mockReturnValue(mockGroup)
            },
          }
        }],
      }).compile();

      const service = module.get<GroupService>(GroupService);
      const prismaService = module.get<PrismaService>(PrismaService);
      const mockPrismaFindUniqueGroup = jest.fn().mockReturnValue(null)

      jest.spyOn(prismaService.group, 'create').mockImplementation(mockPrismaFindUniqueGroup)

      await expect(service.createGroup(body, user)).rejects.toThrowError(ConflictException)
    })
  })
});
