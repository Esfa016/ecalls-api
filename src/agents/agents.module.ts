import { Module } from '@nestjs/common';
import { AgentsService } from './agents.service';
import { AgentsController } from './agents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AgentConfigSchema as AgentsSchema, Agents } from './Models/agentSchema';
import { ApiCallsModule } from 'src/api_calls/api_calls.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agents.name, schema: AgentsSchema }])],
  controllers: [AgentsController],
  providers: [AgentsService],
})
export class AgentsModule {}
