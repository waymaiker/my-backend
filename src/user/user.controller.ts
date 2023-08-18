import { Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from 'src/dtos/user.dto';
import { Subscription } from 'src/dtos/shared/types';

@Controller('users/:scope')
export class UserController {

  constructor(
    private readonly userService: UserService
  ){}

  @Get()
  getUsers(
    @Param('scope', new ParseEnumPipe(Subscription)) scope: string
  ): UserResponseDto[] {
    const userSubscription = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.userService.getUsers(userSubscription);
  }

  @Get(':id')
  getUserById(
    @Param('scope', new ParseEnumPipe(Subscription)) scope: string,
    @Param('id', ParseUUIDPipe) id: string
  ): UserResponseDto {
    const userSubscription = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.userService.getUserById(userSubscription, id);
  }

  @Post()
  createUser(
    @Param('scope',  new ParseEnumPipe(Subscription)) scope: string,
    @Body() {pseudo, profile_language}: CreateUserDto
  ): UserResponseDto {
    const userSubscription = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.userService.createUser(userSubscription, {pseudo, profile_language});
  }

  @Put(':id')
  updateUser(
    @Param('scope',  new ParseEnumPipe(Subscription)) scope: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): UserResponseDto {
    const userSubscription = scope === 'freemium' ? Subscription.FREEMIUM : Subscription.PREMIUM;
    return this.userService.updateUser(userSubscription, id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    return this.userService.deleteUser(id);
  }
}
