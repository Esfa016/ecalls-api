import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { LLMDto } from '../DTO/agentDTO';
import { Users } from 'src/users/Models/userSchema';

@Schema({ timestamps: true })
export class Agents extends Document {
  @Prop({   })
  voice: string;

  @Prop({   })
  voiceSpeed: number;

  @Prop({   })
  displayName: string;

  @Prop({   })
  description: string;

  @Prop({   })
  greeting: string;

  @Prop({   })
  prompt: string;

  @Prop({   })
  criticalKnowledge: string;

  @Prop({ enum: ['public', 'private'],   })
  visibility: string;

  @Prop({ type: Boolean,   })
  answerOnlyFromCriticalKnowledge: boolean;

  @Prop({type:Object})
  llm:LLMDto

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
  createdBy: mongoose.Schema.Types.ObjectId
  
  @Prop({index:true})
  agentId:string
}
export const AgentConfigSchema = SchemaFactory.createForClass(Agents);