import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
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

  async createGroup({name, description, followers, admins}: CreateGroupParams){
    const isGroupExists = await this.prismaService.group.findFirst({ where: { name } });

    if(isGroupExists){
      throw new ConflictException("This group name is already used")
    }

    const group = await this.prismaService.group.create({
      data: {
        name,
        description
      }
    })

    if(followers){
      const assignGroupIdTofollowers = followers.map(follower => {
        return {user_id: follower.user_id, group_id: group.id} }
      );

      await this.prismaService.followersGroup.createMany({ data: assignGroupIdTofollowers })
    }

    if(admins){
      const assignGroupIdToAdmins = admins.map(admin => {
        return {user_id: admin.user_id, group_id: group.id, assigned_by: admin.user_id} }
      );
      await this.prismaService.adminsGroup.createMany({ data: assignGroupIdToAdmins })
    }

    return this.getGroupById({id: group.id});
  }
}
