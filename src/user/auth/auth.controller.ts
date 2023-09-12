import * as bcrypt from 'bcryptjs';
import { Body, Controller, Param, ParseEnumPipe, Post, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserType } from '@prisma/client';

import { GenerateProductKey, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../guards/auth.guards';
import { Roles } from '../../decorators/roles.decorator';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {

  constructor(private readonly authService: AuthService){}

  @Roles(UserType.USER)
  @Post("/signup/:userType")
  async signup(
    @Body() body: SignUpDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ){

    body.user_type = userType;
    if(userType !== UserType.USER){
      if(!body.productKey){
        throw new UnauthorizedException()
      }

      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

      if(!isValidProductKey) {
        throw new UnauthorizedException()
      }
    }

    return this.authService.signup(body);
  }

  @Roles(UserType.USER, UserType.ADMIN, UserType.SUPER_ADMIN)
  @Post("/signin")
  signin(@Body() body: SignInDto){
    return this.authService.signin(body);
  }

  @Roles(UserType.SUPER_ADMIN)
  @Post("/key/:type")
  generateProductKey(
    @Body() { userType, email }: GenerateProductKey,
    @Param('type', new ParseEnumPipe(UserType)) type: UserType,
  ){
    return this.authService.generateProductKey(email, userType);
  }
}
