import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import config from './configs'
import { MongooseModule } from '@nestjs/mongoose';
import { AgentsModule } from './agents/agents.module';
import { ApiCallsModule } from './api_calls/api_calls.module';
import { ConversationsModule } from './conversations/conversations.module';
import { CustomActionModule } from './custom-action/custom-action.module';
import { LlmsModule } from './llms/llms.module';
import { WebtrcModule } from './webtrc/webtrc.module';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [config]
    }),
    AuthModule,
    UsersModule,
    MongooseModule.forRoot(process.env.DB_CONN),
    AgentsModule,
    ApiCallsModule,
    ConversationsModule,
    CustomActionModule,
    LlmsModule,
    WebtrcModule,
  
   
  
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
