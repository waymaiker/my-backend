import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserWhoRequested } from 'src/decorators/user.decorator';
import { Admin, Follower, GroupResponseDto } from './dto/group.dto';

interface GetGroupsParams {
  id?: number
  name?: string
  adminId?: string
  followerId?: string
  is_public?: boolean
  restricted_access?: boolean
}

interface CreateGroupParams {
  name: string;
  description: string;
  followers?: Follower[]
  admins?: Admin[]
}

interface UpdateGroupParams {
  name: string;
  description: string;
}

@Injectable()
export class GroupService {

  constructor(private readonly prismaService: PrismaService){}

  async getGroups(filter: GetGroupsParams): Promise<GroupResponseDto[]>{
    const filters: Prisma.GroupWhereInput = {
      ...filter,
    };

    const groups = await this.prismaService.group.findMany({
      where: filters,
      include: {
        followers: true,
        admins: true
      }
    });

    if(!groups.length) {
      throw new NotFoundException();
    }

    return groups.map((group) => new GroupResponseDto(group))
  }

  async getGroupById({id}: GetGroupsParams){
    const group = await this.prismaService.group.findUnique({
      where: { id },
      include: {
        followers: true,
        admins: true
      }
    })

    if(!group){
      throw new NotFoundException()
    }

    return new GroupResponseDto(group);
  }

  async createGroup({name, description, followers, admins}: CreateGroupParams, user: UserWhoRequested){
    const isGroupExists = await this.prismaService.group.findFirst({ where: { name } });

    if(isGroupExists){
      throw new ConflictException("This group name is already used")
    }

    if(!user){
      throw new UnauthorizedException()
    }

    const group = await this.prismaService.group.create({
      data: {
        name,
        description,
        creator_id: user.id
      }
    })

    const assignGroupCreatorAsAnAdmin = {user_id: user.id, group_id: group.id, assigned_by: user.id}
    await this.prismaService.adminsGroup.create({ data: assignGroupCreatorAsAnAdmin })

    if(followers){
      const assignGroupIdOfFollowers = followers.map(follower => {
        return {user_id: follower.user_id, group_id: group.id} }
      );

      await this.prismaService.followersGroup.createMany({ data: assignGroupIdOfFollowers })
    }

    if(admins){
      const assignGroupIdOfAdmins = admins.map(admin => {
        return {user_id: admin.user_id, group_id: group.id, assigned_by: admin.user_id} }
      );
      await this.prismaService.adminsGroup.createMany({ data: assignGroupIdOfAdmins })
    }

    return this.getGroupById({id: group.id});
  }

  async updateGroupById(id: number, body: UpdateGroupParams) {
    const group = await this.prismaService.group.findUnique({ where: {id} })

    if(!group){
      throw new NotFoundException();
    }

    const updateGroup = await this.prismaService.group.update({
      where: {id},
      data: body
    })

    return new GroupResponseDto(updateGroup);
  }

  async deleteGroupById(id: number) {
    const isGroupExists = await this.prismaService.group.findFirst({ where: { id } });

    if(!isGroupExists){
      throw new ConflictException("This group id doesnt exist")
    }

    await this.prismaService.adminsGroup.deleteMany({ where: { group_id: id } })
    await this.prismaService.followersGroup.deleteMany({ where: { group_id: id } })
    await this.prismaService.group.delete({ where: {id} })
  }

  async getCreatorByGroupId(id: number) {
    const group = await this.prismaService.group.findUnique({ where: { id }});

    if(!group){
      throw new NotFoundException();
    }

    return group.creator_id;
  }

  async getAdminsByGroupId(id: number) {
    const groupAdmins = await this.prismaService.group.findUnique({
      where: <Prisma.GroupWhereUniqueInput>  {
        id,
        admins: {
          some: {
            group_id: id
          }
        },
      },
      select: {
        id: true,
        name: true,
        admins: true
      }
    });

    if(!groupAdmins){
      throw new NotFoundException();
    }

    return groupAdmins.admins;
  }
}
