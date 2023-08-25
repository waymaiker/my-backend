import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { CreateGroupDto, GroupResponseDto } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('groups')
export class GroupController {

  constructor(private readonly groupService: GroupService){}

  @Get()
  getGroups(
    @Query('name') name?: string,
    @Query('adminId') adminId?: string,
    @Query('followerId') followerId?: string,
    @Query('isPublic') isPublic?: boolean,
    @Query('restrictedAccess') restrictedAccess?: boolean,
  ): Promise<GroupResponseDto[]>{
    const filters = {
      ...(name && {name}),
      ...(adminId && {
        admins: {
          some: {
            user_id: adminId
          }
        }}
      ),
      ...(followerId && {
        followers: {
          some: {
            user_id: followerId
          }
        }}
      ),
      ...(isPublic && {is_public: isPublic}),
      ...(restrictedAccess && {restricted_access: restrictedAccess}),
    }

    return this.groupService.getGroups(filters);
  }

  @Get(':id')
  getGroupById(@Param('id', ParseIntPipe) id: number){
    return this.groupService.getGroupById({id});
  }

  @Post()
  createGroup(@Body() body: CreateGroupDto){
    return this.groupService.createGroup(body);
  }

  @Put(':id')
  updateGroup(){
    return {}
  }

  @Delete(':id')
  deleteGroup(){

  }
}
