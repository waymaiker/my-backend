import { APP_INTERCEPTOR } from '@nestjs/core';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';

//Module
import { UserModule } from './user/user.module';
import { ExerciseModule } from './exercise/exercise.module';

//Controllers
import { AppController } from './app.controller';
import { UserController } from 'src/user/user.controller';
import { ExerciseController } from './exercise/exercise.controller';

//Services
import { AppService } from './app.service';
import { UserService } from 'src/user/user.service';
import { ExerciseService } from './exercise/exercise.service';
import { ChapterModule } from './chapter/chapter.module';

@Module({
  imports: [UserModule, ExerciseModule, ChapterModule],
  controllers: [AppController, UserController, ExerciseController],
  providers: [AppService, UserService, {
    provide: APP_INTERCEPTOR,
    useClass: ClassSerializerInterceptor
  }, ExerciseService],
})
export class AppModule {}
