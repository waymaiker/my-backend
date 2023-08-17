import { Module } from '@nestjs/common';

//Controllers
import { AppController } from './app.controller';
import { UserController } from './user.controller';

//Services
import { AppService } from './app.service';
import { UserService } from './user.service';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule {}
