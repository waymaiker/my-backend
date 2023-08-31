import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

import { UserResponseDto } from "src/user/dtos/user.dto";
import { PrismaService } from "src/prisma/prisma.service";
import { SubscriptionType, Language, UserType, Prisma } from "@prisma/client";

interface GetUserParams {
  scope?: SubscriptionType
  user_type?: UserType
}

export interface CreateUser {
  pseudo: string,
  profile_language: Language,
  phone: string;
  email: string;
  password: string;
  user_type: UserType,
  scope: SubscriptionType
}

interface UpdateUser {
  pseudo?: string,
  profile_language?: Language,
  scope?: SubscriptionType,
  finished_level?: number,
}

@Injectable()
export class UserService {

  constructor(private readonly prismaService: PrismaService){}

  async getUsers(filter: GetUserParams): Promise<UserResponseDto[]>{
    const filters: Prisma.UserWhereInput = {...filter};
    const users = await this.prismaService.user.findMany({
      where: filters,
      include: {
        followings: true,
        groups: true
      }
    });

    if(!users.length) {
      throw new NotFoundException();
    }

    return users.map((user) => new UserResponseDto(user));
  }

  async getUserById(id: string){
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if(!user){
      throw new NotFoundException();
    };

    return new UserResponseDto(user);
  }

  async createUser(
    {
      pseudo, phone, email, password, profile_language, user_type, scope
    }: CreateUser
  ){

    const emailAlreadyUsed = await this.prismaService.user.findUnique({
      where: {
        email: email
      }
    })

    if(emailAlreadyUsed){
      throw new ConflictException("This email is already used")
    }

    const pseudoAlreadyUsed = await this.prismaService.user.findUnique({
      where: {
        pseudo: pseudo
      }
    })

    if(pseudoAlreadyUsed){
      throw new ConflictException("This pseudo is already used");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let dataToCreateUser: Prisma.UserCreateInput = {
      email: email,
      phone: phone,
      password: hashedPassword,
      profile_language,
      pseudo: pseudo,
      finished_level: 0,
      scope,
      user_type
    };

    const user = await this.prismaService.user.create({data: dataToCreateUser});
    return new UserResponseDto(user);
  }

  async updateUserById(id: string, body: UpdateUser) {
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if(!user){
      throw new NotFoundException()
    }

    const pseudoAlreadyUsed = await this.prismaService.user.findUnique({ where: { pseudo: body.pseudo } })

    if(pseudoAlreadyUsed){
      throw new ConflictException("This pseudo is already used");
    }

    let dataToUpdateUser: Prisma.UserUpdateInput = {
      ...body,
      updated_at: new Date()
    };

    const updatedUser = await this.prismaService.user.update({
      data: dataToUpdateUser,
      where: {id}
    });

    return new UserResponseDto(updatedUser);
  }

  async deleteUser(id: string){
    const user = await this.prismaService.user.findUnique({ where: { id } });

    if(!user){
      throw new NotFoundException()
    }

    await this.prismaService.user.delete({ where: { id } });

    const users = await this.prismaService.user.findMany({
      where: {
        user_type: UserType.USER
      }
    });

    return users.map((user) => new UserResponseDto(user));
  }
}