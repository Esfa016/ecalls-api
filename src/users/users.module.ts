import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, UserSchema } from './Models/userSchema';
import { UserOTP, UserOtpSchema } from './Models/otpSchema';


@Module({
 imports:[MongooseModule.forFeature([{name:Users.name,schema:UserSchema},{name:UserOTP.name,schema:UserOtpSchema}])],
  controllers: [],
  providers: [UsersService],
  exports:[UsersService]
})
export class UsersModule {}
