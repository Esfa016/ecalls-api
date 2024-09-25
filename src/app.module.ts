import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import config from './configs'
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [config]
    }),
    AuthModule, UsersModule,
    MongooseModule.forRoot(process.env.DB_CONN),
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
