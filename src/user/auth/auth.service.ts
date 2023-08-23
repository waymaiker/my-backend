import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Language, Prisma, UserType } from '@prisma/client';
import { ConflictException, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { AuthenticatedUser } from '../user.service';

@Injectable()
export class AuthService {

  constructor(private readonly prismaService: PrismaService){}

  async signup(body: AuthenticatedUser){
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
      user_type: UserType.USER
    };

    const user = await this.prismaService.user.create({data: dataToCreateUser})
    const token = await jwt.sign({
      name: user.pseudo,
      id: user.id
    }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

    return token;
  }
}