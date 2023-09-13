import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

//Module
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { GroupModule } from './group/group.module';

//Controllers
import { AppController } from './app.controller';

//Services
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';

//Providers
import { UserInterceptor } from 'src/interceptors/user.interceptor';

@Module({
  imports: [UserModule, PrismaModule, GroupModule],
  controllers: [AppController],
  providers: [AppService, UserService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  }],
})
export class AppModule {}
