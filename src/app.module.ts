import { ClassSerializerInterceptor, Module } from '@nestjs/common';

//Controllers
import { AppController } from './app.controller';
import { UserController } from './user.controller';

//Services
import { AppService } from './app.service';
import { UserService } from './user.service';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }],
})
export class AppModule {}
