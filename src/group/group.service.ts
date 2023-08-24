import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupResponseDto } from './dto/group.dto';

@Injectable()
export class GroupService {

  constructor(private readonly prismaService: PrismaService){}

  async getGroups(): Promise<GroupResponseDto[]>{
    const groups = await this.prismaService.group.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        is_public: true,
        restricted_access: true,
        followers: {
          select: {
            groupId: false,
            userId: true,
            created_at: false
          }
        },
        admins: {
          select: {
            groupId: false,
            userId: true,
            assigned_at: false,
            assigned_by: false
          }
        }
      },
    });

    return groups.map((group) => new GroupResponseDto(group))
  }
}
