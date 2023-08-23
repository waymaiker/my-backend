import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Language, Prisma, UserType } from '@prisma/client';
import { ConflictException, HttpException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedUser } from '../user.service';

interface SignInParams {
  email: string,
  password: string
}

@Injectable()
export class AuthService {

  constructor(private readonly prismaService: PrismaService){}

  async signup(body: AuthenticatedUser, userType: UserType){
    const emailAlreadyUsed = await this.prismaService.user.findUnique({
      where: {
        email: body.email
      }
    })

    if(emailAlreadyUsed){
      throw new ConflictException("This email is already used")
    }

    const pseudoAlreadyUsed = await this.prismaService.user.findUnique({
      where: {
        pseudo: body.pseudo
      }
    })

    if(pseudoAlreadyUsed){
      throw new ConflictException("This pseudo is already used")
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    let dataToCreateUser: Prisma.UserCreateInput = {
      email: body.email,
      phone: body.phone,
      password: hashedPassword,
      profile_language: Language.ENGLISH,
      pseudo: body.pseudo,
      finished_level: 0,
      scope: "FREEMIUM",
      user_type: userType
    };

    const user = await this.prismaService.user.create({data: dataToCreateUser})
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

  private generateJWT(name: string, id: string){
    return jwt.sign({ name, id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
  }

  generateProductKey(email: string, userType: UserType){
    const string =  `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}