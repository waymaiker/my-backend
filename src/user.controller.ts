import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put } from '@nestjs/common';

import { AccountType, data } from 'src/data';
import { UserService } from './user.service';

@Controller('users/:accountType')
export class UserController {

  constructor(
    private readonly userService: UserService
  ){}

  @Get()
  getUsers(@Param('accountType') accountType: string) {
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.getUsers(userAccountType);
  }

  @Get(':id')
  getUserById(
    @Param('accountType') accountType: string,
    @Param('id') id: string
  ){
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.getUserById(userAccountType, id);
  }

  @Post()
  createUser(
    @Param('accountType') accountType: string,
    @Body() {pseudo}: {
      pseudo: string,
    }
  ){
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.createUser(userAccountType, {pseudo});
  }

  @Put(':id')
  updateUser(
    @Param('accountType') accountType: string,
    @Param('id') id: string,
    @Body() {pseudo}: {
      pseudo: string,
    },
  ){
    const userAccountType = accountType === 'freemium' ? AccountType.FREEMIUM : AccountType.PREMIUM;
    return this.userService.updateUser(userAccountType, id, {pseudo});
  }

  @HttpCode(204)
  @Delete(':id')
  deleteUser(@Param('id') id: string){
    return this.userService.deleteUser(id);
  }
}
