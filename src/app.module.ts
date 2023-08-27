import { APP_INTERCEPTOR } from '@nestjs/core';
import { Module } from '@nestjs/common';

//Module
import { UserModule } from './user/user.module';
import { ExerciseModule } from './exercise/exercise.module';

//Controllers
import { AppController } from './app.controller';

//Services
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';
import { ExerciseService } from './exercise/exercise.service';
import { ChapterModule } from './chapter/chapter.module';
import { PrismaModule } from './prisma/prisma.module';
import { GroupModule } from './group/group.module';
import { UserInterceptor } from './user/interceptors/user.interceptor';

@Module({
  imports: [UserModule, ExerciseModule, ChapterModule, PrismaModule, GroupModule],
  controllers: [AppController],
  providers: [AppService, UserService, {
    provide: APP_INTERCEPTOR,
    useClass: UserInterceptor
  }, ExerciseService],
})
export class AppModule {}
