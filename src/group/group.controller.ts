import { UserType } from '@prisma/client';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException, UseGuards } from '@nestjs/common';

import { AuthGuard } from '../guards/auth.guards';
import { Roles } from '../decorators/roles.decorator';
import { User } from '../decorators/user.decorator';

import { CreateGroupDto, GroupResponseDto, UpdateGroupDto } from './dto/group.dto';
import { GroupService } from './group.service';

@Controller('groups')
@UseGuards(AuthGuard)
export class GroupController {

  constructor(private readonly groupService: GroupService){}

  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
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

  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @Get(':id')
  getGroupById(@Param('id', ParseIntPipe) id: number){
    return this.groupService.getGroupById({id});
  }

  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @UseGuards(AuthGuard)
  @Post()
  createGroup(@Body() body: CreateGroupDto, @User() user){
    return this.groupService.createGroup(body, user);
  }

  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @Put(':id')
  async updateGroup(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: UpdateGroupDto,
    @User() user
  ){
    const groupAdmins = await this.groupService.getAdminsByGroupId(id);
    const userIsAnAdminGroup = groupAdmins.find((admin) => admin.user_id == user.id);

    if(!userIsAnAdminGroup){
      throw new UnauthorizedException();
    }

    return this.groupService.updateGroupById(id, body);
  }

  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @HttpCode(204)
  @Delete(':id')
  deleteGroup(
    @Param("id", ParseIntPipe) id: number,
    @User() user
  ){
    const groupCreatorId = this.groupService.getCreatorByGroupId(id);

    if(groupCreatorId != user.id){
      throw new UnauthorizedException();
    }

    return this.groupService.deleteGroupById(id);
  }
}
