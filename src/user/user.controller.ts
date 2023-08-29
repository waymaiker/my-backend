import { Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, ParseUUIDPipe, Post, Put, Query } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from 'src/user/dtos/user.dto';
import { SubscriptionType, UserType } from '@prisma/client';

@Controller('users')
export class UserController {

  constructor(private readonly userService: UserService){}

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

  @Get(':id')
  getUserById(@Param('id', ParseUUIDPipe) id: string){
    return this.userService.getUserById(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto){
    return this.userService.createUser(body);
  }

  @Put(':id')
  updateUserById(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUserById(id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    return this.userService.deleteUser(id);
  }
}
