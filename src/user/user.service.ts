import { Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';

import { data } from "src/data";
import { UserResponseDto } from "src/user/dtos/user.dto";
import { Language, Subscription } from "src/dtos/shared/types";
import { isUserExist } from "./helpers/helpers";

interface AnonymousUser {
  pseudo: string,
  profile_language: Language,
}

export interface AuthenticatedUser {
  pseudo: string,
  profile_language: Language,
  phone: string;
  email: string;
  password: string;
}

interface UpdateUser {
  pseudo?: string,
  profile_language?: Language,
  scope?: Subscription,
  finished_level?: number,
}

@Injectable()
export class UserService {
  getUsers(scope: Subscription): UserResponseDto[] {
    return data.users
      .filter((users) => users.scope === scope)
      .map((user) => new UserResponseDto(user));
  }

  getUserById(scope: Subscription, id: string): UserResponseDto {
    const user = data.users
      .filter((users) => users.scope === scope)
      .find((user) => user.id === id)

    if(!user) return;

    return new UserResponseDto(user);
  }

  createAnonymousUser(scope: Subscription, {pseudo, profile_language}: AnonymousUser): UserResponseDto {
    const newUser = {
      id: uuid(),
      pseudo,
      profile_language,
      scope,
      phone: '',
      email: '',
      password: '',
      finished_level: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    data.users.push(newUser);
    return new UserResponseDto(newUser);
  }

  createAuthenticatedUser(
    scope: Subscription, {
      pseudo, phone, email, password, profile_language
    }: AuthenticatedUser
  ): UserResponseDto {
    if(isUserExist(scope, pseudo, email, phone)) return

    const newUser = {
      id: uuid(),
      pseudo,
      profile_language,
      scope,
      phone,
      email,
      password,
      finished_level: 0,
      created_at: new Date(),
      updated_at: new Date(),
    };

    data.users.push(newUser);
    return new UserResponseDto(newUser);
  }

  updateUser(scope: Subscription, id: string, body: UpdateUser): UserResponseDto {
    const userToUpdate = data.users
      .filter((users) => users.scope === scope)
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