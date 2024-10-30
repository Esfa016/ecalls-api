import { AgentConfigSchema as AgentsSchema, Agents } from '../agents/Models/agentSchema';

import { MongooseModule } from "@nestjs/mongoose";
import { Module } from "@nestjs/common";
import { WebrtcGateway } from './webtrc.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Agents.name, schema: AgentsSchema }])
  ],
  controllers: [],
  providers: [ WebrtcGateway]
})
export class WebtrcModule {}