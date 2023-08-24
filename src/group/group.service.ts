import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GroupService {

  constructor(private readonly prismaService: PrismaService){}

  async getGroups(){
    return await this.prismaService.group.findMany();
  }
}
