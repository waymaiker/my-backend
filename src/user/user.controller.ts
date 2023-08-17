import { Body, Controller, Delete, Get, HttpCode, Param, ParseEnumPipe, ParseUUIDPipe, Post, Put } from '@nestjs/common';

import { UserService } from './user.service';
import { AccountType, CreateUserDto, UpdateUserDto, UserResponseDto } from 'src/dtos/user.dto';

@Controller('users/:accountType')
export class UserController {

  constructor(
    private readonly userService: UserService
  ){}

  @Get()
  getUsers(
    @Param('accountType', new ParseEnumPipe(AccountType)) accountType: string
  ): UserResponseDto[] {
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.getUsers(userAccountType);
  }

  @Get(':id')
  getUserById(
    @Param('accountType', new ParseEnumPipe(AccountType)) accountType: string,
    @Param('id', ParseUUIDPipe) id: string
  ): UserResponseDto {
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.getUserById(userAccountType, id);
  }

  @Post()
  createUser(
    @Param('accountType',  new ParseEnumPipe(AccountType)) accountType: string,
    @Body() {pseudo}: CreateUserDto
  ): UserResponseDto {
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.createUser(userAccountType, {pseudo});
  }

  @Put(':id')
  updateUser(
    @Param('accountType',  new ParseEnumPipe(AccountType)) accountType: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: UpdateUserDto,
  ): UserResponseDto {
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.updateUser(userAccountType, id, body);
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id', ParseUUIDPipe) id: string){
    return this.userService.deleteUser(id);
  }
}
