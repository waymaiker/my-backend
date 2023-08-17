import { Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';

import { data } from "src/data";
import { Language, ProfileType, UserResponseDto } from "src/dtos/user.dto";

interface User {
  pseudo: string,
  profile_language: Language
}

interface UpdateUser {
  pseudo?: string,
  level?: number
}

@Injectable()
export class UserService {
  getUsers(type: ProfileType): UserResponseDto[] {
    return data.users
      .filter((users) => users.profile_type === type)
      .map((user) => new UserResponseDto(user));
  }

  getUserById(type: ProfileType, id: string): UserResponseDto {
    const user = data.users
      .filter((users) => users.profile_type === type)
      .find((user) => user.id === id)

    if(!user) return;

    return new UserResponseDto(user);
  }

  createUser(profile_type: ProfileType, {pseudo, profile_language}: User): UserResponseDto {
    const newUser = {
      id: uuid(),
      pseudo,
      level: 0,
      profile_language,
      profile_type,
      finished_level: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    data.users.push(newUser);
    return new UserResponseDto(newUser);
  }

  updateUser(profile_type: ProfileType, id: string, body: UpdateUser): UserResponseDto {
    const userToUpdate = data.users
      .filter((users) => users.profile_type === profile_type)
      .find((user) => user.id === id)

    if(!userToUpdate) return;

    const userIndex = data.users.findIndex((user) => user.id === id)
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...body,
      updated_at: new Date()
    };

    return new UserResponseDto(data.users[userIndex]);
   }

  deleteUser(id: string){
    const userIndex = data.users.findIndex((user) => user.id === id)

    if(userIndex === -1) return;

    data.users.splice(userIndex, 1);
    return;
  }
}