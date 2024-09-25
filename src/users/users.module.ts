import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './Models/userSchema';


@Module({
 imports:[MongooseModule.forFeature([{name:Users.name,schema:UserSchema}])],
  controllers: [],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
