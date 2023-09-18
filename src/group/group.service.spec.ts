import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { data } from 'src/data';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupService } from './group.service';

const mockGroups = data.groups
const mockGroup = data.groups.find(group => group.id == 1)
const mockCreatedGroup = {
  id: 1,
  creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  name: "Mon Group Test",
  description: "Apprends le wolof en 1 an avec la Wolof academy",
  is_public: false,
  restricted_access: true,
}

const mockAdmins = [{
    group_id: 1,
    user_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
    assigned_by: "653c7602-adae-4bca-b11b-6f3cd341f663"
  },
  {
    group_id: 1,
    user_id: "3e0c2835-797f-4b90-bc17-d8c9de8dc95f",
    assigned_by: "653c7602-adae-4bca-b11b-6f3cd341f663"
  },
  {
    group_id: 1,
    user_id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141",
    assigned_by: "653c7602-adae-4bca-b11b-6f3cd341f663"
  }
]

const mockFollowers = [
  {
    group_id: 1,
    user_id: "d3a8a76d-cdc0-4b58-8ee3-6f51769c7141",
    created_at: "2023-08-29T17:27:25.825Z"
  },
  {
    group_id: 1,
    user_id: "b1b73451-ef58-48ca-b6e5-188358c30fc1",
    created_at: "2023-08-29T17:27:25.825Z"
  }
]

const mockGroupWithAdmin = {
  id: 1,
  creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  name: "Mon Group Test",
  description: "Apprends le wolof en 1 an avec la Wolof academy",
  is_public: false,
  restricted_access: true,
  admins: [
    mockAdmins[0]
  ]
}

const mockGroupWithAdminAndFollowers = {
  id: 1,
  creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  name: "Mon Group Test",
  description: "Apprends le wolof en 1 an avec la Wolof academy",
  is_public: false,
  restricted_access: true,
  followers: mockFollowers,
  admins: [
    mockAdmins[0]
  ]
}

const mockGroupWithAdmins = {
  id: 1,
  creator_id: "653c7602-adae-4bca-b11b-6f3cd341f663",
  name: "Mon Group Test",
  description: "Apprends le wolof en 1 an avec la Wolof academy",
  is_public: false,
  restricted_access: true,
  admins: [
    mockAdmins[0],
    mockAdmins[1],
    mockAdmins[2]
  ]
}

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
            findUnique: jest.fn().mockReturnValue(mockGroupWithAdmin),
            create: jest.fn().mockReturnValue(mockCreatedGroup),
            findFirst: jest.fn().mockReturnValue(null),
          },
          adminsGroup: {
            create: jest.fn().mockReturnValue([mockAdmins[0]]),
          },
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
    const filters = {};

    it('should find many groups with correct parameters', async () => {
      const mockPrismaFindManyGroups = jest.fn().mockReturnValue(mockGroups)
      jest.spyOn(prismaService.group, 'findMany').mockImplementation(mockPrismaFindManyGroups)

      const groups = await service.getGroups(filters)

      expect(mockPrismaFindManyGroups).toBeCalledWith({
        where: filters,
        include: {
          followers: true,
          admins: true
        }
      })

      expect(groups.length).toBeGreaterThan(1)
    })

    it('should throw NotFoundException if no group has been found', async () => {
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

      const foundGroup = await service.getGroupById(filters)

      expect(mockPrismaFindUniqueGroup).toBeCalledWith({
        where: filters,
        include: {
          followers: true,
          admins: true
        }
      })

      expect(foundGroup.id).toEqual(filters.id)
    })

    it('should throw NotFoundException if no group has been found', async () => {
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

    it('should create a group which contains the group creator as an admin', async () => {
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
          user_id: createdGroup.creator_id,
          assigned_by: createdGroup.creator_id,
        }
      })

      expect(createdGroup.admins.length).toEqual(1)
      expect(createdGroup.admins.find(admin => admin.user_id == createdGroup.creator_id)).toBeDefined()
    })

    it('should create a group with the creator as an admin and several followers', async () => {
      const body = {
        name: "Mon Group Test",
        description: "Apprends le wolof en 1 an avec la Wolof academy",
        followers: mockFollowers,
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [GroupService, {
          provide: PrismaService,
          useValue: {
            group: {
              findMany: jest.fn().mockReturnValue([mockGroups]),
              findUnique: jest.fn().mockReturnValue(mockGroupWithAdminAndFollowers),
              create: jest.fn().mockReturnValue(mockCreatedGroup),
              findFirst: jest.fn().mockReturnValue(null)
            },
            adminsGroup: {
              create: jest.fn().mockReturnValue([mockAdmins[0]]),
            },
            followersGroup: {
              createMany: jest.fn().mockReturnValue(mockFollowers)
            }
          }
        }],
      }).compile();

      service = module.get<GroupService>(GroupService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaCreateGroup = jest.fn().mockReturnValue(mockCreatedGroup)
      const mockPrismaCreateGroupAdmin = jest.fn().mockReturnValue(mockGroupWithAdmin)
      const mockPrismaCreateGroupAdminAndFollowers = jest.fn().mockReturnValue(mockGroupWithAdminAndFollowers)

      jest.spyOn(prismaService.group, 'create').mockImplementation(mockPrismaCreateGroup)
      jest.spyOn(prismaService.adminsGroup, 'create').mockImplementation(mockPrismaCreateGroupAdmin)
      jest.spyOn(prismaService.followersGroup, 'createMany').mockImplementation(mockPrismaCreateGroupAdminAndFollowers)

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
          user_id: mockAdmins[0].user_id,
          assigned_by: createdGroup.creator_id,
        }
      })

      expect(mockPrismaCreateGroupAdminAndFollowers).toBeCalledWith({
        data: [{
          group_id: mockFollowers[0].group_id,
          user_id: mockFollowers[0].user_id,
        },
        {
          group_id: mockFollowers[1].group_id,
          user_id: mockFollowers[1].user_id,
        }]
      })

      expect(createdGroup.admins.length).toEqual(1)
      expect(createdGroup.admins.find(admin => admin.user_id == createdGroup.creator_id)).toBeDefined()
      expect(createdGroup.followers.length).toBeGreaterThan(1)
      expect(createdGroup.followers.length).toEqual(mockGroupWithAdminAndFollowers.followers.length)
    })

    it('should create a group with the creator as an admin and several admins', async () => {
      const body = {
        name: "Mon Group Test",
        description: "Apprends le wolof en 1 an avec la Wolof academy",
        admins: [mockAdmins[1], mockAdmins[2]],
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [GroupService, {
          provide: PrismaService,
          useValue: {
            group: {
              findMany: jest.fn().mockReturnValue([mockGroups]),
              findUnique: jest.fn().mockReturnValue(mockGroupWithAdmins),
              create: jest.fn().mockReturnValue(mockCreatedGroup),
              findFirst: jest.fn().mockReturnValue(null)
            },
            adminsGroup: {
              create: jest.fn().mockReturnValue([mockAdmins[0]]),
              createMany: jest.fn().mockReturnValue([mockAdmins[1], mockAdmins[2]]),
            }
          }
        }],
      }).compile();

      service = module.get<GroupService>(GroupService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaCreateGroup = jest.fn().mockReturnValue(mockCreatedGroup)
      const mockPrismaCreateGroupAdmin = jest.fn().mockReturnValue(mockGroupWithAdmin)
      const mockPrismaCreateGroupAdmins = jest.fn().mockReturnValue([mockAdmins[1], mockAdmins[2]])

      jest.spyOn(prismaService.group, 'create').mockImplementation(mockPrismaCreateGroup)
      jest.spyOn(prismaService.adminsGroup, 'create').mockImplementation(mockPrismaCreateGroupAdmin)
      jest.spyOn(prismaService.adminsGroup, 'createMany').mockImplementation(mockPrismaCreateGroupAdmins)

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
          user_id: mockAdmins[0].user_id,
          assigned_by: createdGroup.creator_id,
        }
      })

      expect(mockPrismaCreateGroupAdmins).toBeCalledWith({
        data: [{
          group_id: createdGroup.id,
          user_id: mockAdmins[1].user_id,
          assigned_by: createdGroup.creator_id,
        },
        {
          group_id: createdGroup.id,
          user_id: mockAdmins[2].user_id,
          assigned_by: createdGroup.creator_id,
        }]
      })

      expect(createdGroup.admins.find(admin => admin.user_id == createdGroup.creator_id)).toBeDefined()
      expect(createdGroup.admins.length).toBeGreaterThan(1)
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

    it('should throw UnauthorizedException if no group has been found', async () => {
      const mockPrismaFindUniqueGroup = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.group, 'findUnique').mockImplementation(mockPrismaFindUniqueGroup)

      await expect(service.createGroup(body, null)).rejects.toThrowError(UnauthorizedException)
    })
  })

  describe('updateGroupById', () => {
    const filters = { id: 1 }

    const body = {
      name: "Mon Group Update name",
      description: "Apprends le wolof en 1 an avec la Wolof academy",
    };

    it('should update the name of the group equals to the provided Id', async () => {
      const mockGroup = mockGroups.find(user => user.id == filters.id);
      const mockGroupUpdated = {
        ...mockGroup,
        name: body.name,
      };

      const module: TestingModule = await Test.createTestingModule({
        providers: [GroupService, {
          provide: PrismaService,
          useValue: {
            group: {
              findUnique: jest.fn().mockReturnValue(mockGroupWithAdmin),
              update: jest.fn().mockReturnValue(mockGroupUpdated),
            }
          }
        }],
      }).compile();

      service = module.get<GroupService>(GroupService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaUpdatedGroup = jest.fn().mockReturnValue(mockGroupUpdated)
      jest.spyOn(prismaService.group, 'update').mockImplementation(mockPrismaUpdatedGroup)

      const updatedGroup =  await service.updateGroupById(filters.id, body)

      expect(updatedGroup.name == mockGroup.name).toBeFalsy()
      expect(updatedGroup.name == body.name).toBeTruthy()
      expect(updatedGroup.id).toEqual(filters.id)
    })

    it('should throw NotFoundException if no group has been found',async () => {
      const mockPrismaFindUniqueGroup = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.group, 'findUnique').mockImplementation(mockPrismaFindUniqueGroup)

      await expect(service.updateGroupById(2, body)).rejects.toThrowError(NotFoundException)
    })
  })

  describe('deleteGroupById', () => {
    const filters = {
      id: 1
    }

    it('should delete the user with the provided Id', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [GroupService, {
          provide: PrismaService,
          useValue: {
            group: {
              findFirst: jest.fn().mockReturnValue(mockGroup),
              findMany: jest.fn().mockReturnValue(mockGroups.filter(group => group.id != filters.id)),
              delete: jest.fn().mockReturnValue(null),
            },
            adminsGroup: {
              deleteMany: jest.fn().mockReturnValue(null),
            },
            followersGroup: {
              deleteMany: jest.fn().mockReturnValue(null),
            },
          }
        }],
      }).compile();

      service = module.get<GroupService>(GroupService);
      prismaService = module.get<PrismaService>(PrismaService);

      const mockPrismaDeleteGroup = jest.fn().mockReturnValue(data.groups.filter(group => group.id != filters.id))
      jest.spyOn(prismaService.group, 'delete').mockImplementation(mockPrismaDeleteGroup)

      const groupsLeft =  await service.deleteGroupById(filters.id)

      expect(groupsLeft.length).toEqual(data.groups.length - 1)
      expect(groupsLeft.filter(user => user.id == filters.id)).toEqual([])
    })

    it('should throw NotFoundException if no user has been found, based on the userId', async () => {
      const mockPrismaFindUniqueGroup = jest.fn().mockReturnValue(null)
      jest.spyOn(prismaService.group, 'findUnique').mockImplementation(mockPrismaFindUniqueGroup)

      await expect(service.deleteGroupById(filters.id)).rejects.toThrowError(NotFoundException)
    })
  })
});
