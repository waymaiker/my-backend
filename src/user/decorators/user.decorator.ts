import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export interface UserWhoRequested { 
  name: string,
  id: string,
  iat: number,
  exp: number
}

export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
})