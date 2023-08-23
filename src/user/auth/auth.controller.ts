import * as bcrypt from 'bcryptjs';
import { Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException } from '@nestjs/common';
import { UserType } from '@prisma/client';

import { GenerateProductKey, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Post("/signup/:userType")
  async signup(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ){
    if(userType !== UserType.USER){
      if(!body.productKey){
        throw new UnauthorizedException()
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

      console.log(isValidProductKey);

      if(!isValidProductKey) {
        throw new UnauthorizedException()
      }
    }


    return this.authService.signup(body, userType);
  }

  @Post("/signin")
  signin(@Body() body: SignInDto){
    return this.authService.signin(body);
  }

  @Post("/key")
  generateProductKey(@Body() { userType, email }: GenerateProductKey){
    return this.authService.generateProductKey(email, userType);
  }
}
