import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { UserType } from '@prisma/client';
import { HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';
import { CreateUser, UserService } from '../user.service';

interface SignInParams {
  email: string,
  password: string
}

@Injectable()
export class AuthService {

  constructor(private readonly prismaService: PrismaService, private readonly userService: UserService){}

  async signup(body: CreateUser){
    const user = await this.userService.createUser(body)
    return await this.generateJWT(user.pseudo, user.id);
  }

  async signin({email, password}: SignInParams){
    const user = await this.prismaService.user.findUnique({
      where: {
        email
      }
    })

    if(!user){
      throw new HttpException("Invalid credentials", 400)
    }

    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if(!isValidPassword){
      throw new HttpException("Invalid credentials", 400)
    }

    return await this.generateJWT(user.pseudo, user.id);
  }

  generateProductKey(email: string, userType: UserType){
    const string =  `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }

  private generateJWT(name: string, id: string){
    return jwt.sign({ name, id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  }
}