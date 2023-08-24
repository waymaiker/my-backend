import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {

  constructor(private readonly groupService: GroupService){}

  @Get()
  getGroups(){
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
