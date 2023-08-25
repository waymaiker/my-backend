import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupResponseDto } from './dto/group.dto';

interface GetGroupsParams {
  id?: number
  name?: string
  adminId?: string
  followerId?: string
  is_public?: boolean
  restricted_access?: boolean
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
    const group = await this.prismaService.group.findUnique({ where: { id } })

    if(!group){
      throw new NotFoundException()
    }

    return new GroupResponseDto(group);
  }

}
