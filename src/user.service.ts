import { Injectable } from "@nestjs/common";
import { v4 as uuid } from 'uuid';

import { AccountType, data } from "src/data";

interface User {
  pseudo: string,
}

interface UpdateUser {
  pseudo?: string,
  level?: number
}

@Injectable()
export class UserService {
  getUsers(type: AccountType){
    return data.users.filter((users) => users.accountType === type);
  }

  getUserById(type: AccountType, id: string){
    return data.users
      .filter((users) => users.accountType === type)
      .find((user) => user.id === id)
  }

  createUser(accountType: AccountType, {pseudo}: User){
    const newUser = {
      id: uuid(),
      pseudo,
      level: 0,
      created_at: new Date(),
      updated_at: new Date(),
      accountType
    };

    data.users.push(newUser);
    return newUser;
  }

  updateUser(accountType: AccountType, id: string, body: UpdateUser){
    const userToUpdate = data.users
      .filter((users) => users.accountType === accountType)
      .find((user) => user.id === id)

    if(!userToUpdate) return;

    const userIndex = data.users.findIndex((user) => user.id === id)
    data.users[userIndex] = {
      ...data.users[userIndex],
      ...body,
      updated_at: new Date()
    };

    return data.users[userIndex];
  }

  deleteUser(id: string){
    const userIndex = data.users.findIndex((user) => user.id === id)

    if(userIndex === -1) return;

    data.users.splice(userIndex, 1);
    return;
  }
}