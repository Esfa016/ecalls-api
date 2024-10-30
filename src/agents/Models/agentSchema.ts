import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { LLMDto } from '../DTO/agentDTO';
import { Users } from 'src/users/Models/userSchema';

interface ConversationRecording {
  conversationId: string;
  startedAt: Date;
  endedAt: Date;
  createdAt: Date;
  audioData: Buffer;
  duration: number; // in seconds
}

@Schema({ timestamps: true })
export class Agents extends Document {
  @Prop({})
  voice: string;

  @Prop({})
  voiceSpeed: number;

  @Prop({})
  displayName: string;

  @Prop({})
  description: string;

  @Prop({})
  greeting: string;

  @Prop({})
  prompt: string;

  @Prop({})
  criticalKnowledge: string;

  @Prop({ enum: ['public', 'private'] })
  visibility: string;

  @Prop({ type: Boolean })
  answerOnlyFromCriticalKnowledge: boolean;

  @Prop({ type: Object })
  llm: LLMDto;

  @Prop([{
    conversationId: { type: String, required: true, index: true },
    startedAt: { type: Date, default: Date.now },
    endedAt: Date,
    createdAt: { type: Date, default: Date.now },
    audioData: Buffer,
    duration: Number
  }])
  conversationRecordings: ConversationRecording[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Users.name })
  createdBy: mongoose.Schema.Types.ObjectId;

  @Prop({ index: true })
  agentId: string;
}

export const AgentConfigSchema = SchemaFactory.createForClass(Agents);

// Create indexes for efficient querying
AgentConfigSchema.index({ 'conversationRecordings.conversationId': 1 });
AgentConfigSchema.index({ 'conversationRecordings.startedAt': 1 });
AgentConfigSchema.index({ 'conversationRecordings.createdAt': 1 });