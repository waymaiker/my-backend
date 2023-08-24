import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { GroupResponseDto } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {

  constructor(private readonly groupService: GroupService){}

  @Get()
  getGroups(): Promise<GroupResponseDto[]>{
    return this.groupService.getGroups();
  }

  @Get(':id')
  getGroupById(){
    return {};
  }

  @Post()
  createGroup(){
    return []
  }

  @Put(':id')
  updateGroup(){
    return {}
  }

  @Delete(':id')
  deleteGroup(){
    
  }
}
