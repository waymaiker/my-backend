import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, Put, Query, UseGuards } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from 'src/user/dtos/user.dto';
import { SubscriptionType, UserType } from '@prisma/client';
import { Roles } from '../decorators/roles.decorator';
import { AuthGuard } from '../guards/auth.guards';

@Controller('users')
@UseGuards(AuthGuard)
export class UserController {

  constructor(private readonly userService: UserService){}

  @Roles(UserType.USER, UserType.ADMIN, UserType.SUPER_ADMIN)
  @Get()
  getUsers(
    @Query('scope') scope?: string,
    @Query('userType') userType?: string
  ): Promise<UserResponseDto[]> {
    const filters = {
      ...(userType && { user_type: userType === "admin" ? UserType.ADMIN : UserType.USER }),
      ...(scope && { scope: scope === "freemium" ? SubscriptionType.FREEMIUM : SubscriptionType.PREMIUM })
    };

    return this.userService.getUsers(filters);
  }

  @Roles(UserType.USER, UserType.ADMIN, UserType.SUPER_ADMIN)
  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string){
    return this.userService.getUserById(id);
  }

  @Roles(UserType.ADMIN, UserType.SUPER_ADMIN)
  @Post()
  createUser(@Body() body: CreateUserDto){
    return this.userService.createUser(body);
  }

  @Roles(UserType.USER, UserType.ADMIN, UserType.SUPER_ADMIN)
  @Put(':id')
  updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, body);
  }

  @Roles(UserType.USER, UserType.ADMIN, UserType.SUPER_ADMIN)
  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    return this.userService.deleteUser(id);
  }
}
