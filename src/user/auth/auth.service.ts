import { Injectable } from '@nestjs/common';

import { data } from 'src/data';
import { Subscription } from 'src/dtos/shared/types';
import { SignUpResponseDto } from '../dtos/auth.dto';
import { AuthenticatedUser, UserService } from '../user.service';

@Injectable()
export class AuthService {

  // TODO: Handling errors, send an accurate message
  signup(body: AuthenticatedUser): SignUpResponseDto {
    const emailAlreadyUsed = data.users
      .filter((user) => user.email === body.email).shift()

    const pseudoAlreadyUsed = data.users
      .filter((user) => user.pseudo === body.pseudo).shift()

    const phoneAlreadyUsed = data.users
      .filter((user) => user.phone === body.phone).shift()

    if(pseudoAlreadyUsed) return;
    if(phoneAlreadyUsed) return;
    if(emailAlreadyUsed) return;

    const userCreated = new UserService().createAuthenticatedUser(Subscription.FREEMIUM, body);

    return new SignUpResponseDto(userCreated);
  }
}
