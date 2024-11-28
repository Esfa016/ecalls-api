import {
  IsBoolean,
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsObject,
  IsNotEmpty,
  IsOptional,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LLMBaseParamsDto {
  @IsObject()
  defaultHeaders: { [key: string]: string };

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  temperature: number;

  @IsNumber()
  maxTokens: number;
}

export class LLMDto {
  @IsString()
  @IsNotEmpty()
  baseURL: string;

  @IsString()
  @IsNotEmpty()
  apiKey: string;

  @ValidateNested()
  @Type(() => LLMBaseParamsDto)
  baseParams: LLMBaseParamsDto;
}

export class CreateAgentDTO {
  @IsString()
  @IsNotEmpty()
  voice: string;

  @IsNumber()
  voiceSpeed: number;

  @IsString()
  @IsNotEmpty()
  displayName: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  greeting: string;

  @IsString()
  @IsNotEmpty()
  prompt: string;

  @IsString()
  @IsNotEmpty()
  criticalKnowledge: string;

  @IsEnum(['public', 'private'])
  visibility: string;

  @IsBoolean()
  answerOnlyFromCriticalKnowledge: boolean;

  @ValidateNested()
  @Type(() => LLMDto)
  llm: LLMDto;
  @IsArray()
  @IsOptional()
  actions:string[]
}

export class UpdateAgentDTO {
  @IsString()
  @IsOptional()
  voice: string;

  @IsNumber()
  voiceSpeed: number;

  @IsString()
  @IsOptional()
  displayName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  greeting: string;

  @IsString()
  @IsOptional()
  prompt: string;

  @IsString()
  @IsOptional()
  criticalKnowledge: string;
  @IsOptional()
  @IsEnum(['public', 'private'])
  visibility: string;

  @IsBoolean()
  @IsOptional()
  answerOnlyFromCriticalKnowledge: boolean;

  @ValidateNested()
  @Type(() => LLMDto)
  llm: LLMDto;
  @IsArray()
  @IsOptional()
  actions: string[];
}

export interface IAgentStats {
  id: string;
  numberOfConversations: number;
  numberOfPhoneConversations: number;
  numberOfSecondsTalked: number;
}
export enum CountryCodes  {
  US = 'US',
  CA = 'CA',
  GB = 'GB'

}

export class AddPhoneNumberToAgentDTO{
  @IsEnum(CountryCodes)
  @IsNotEmpty()
  countryCode: CountryCodes
  @IsOptional()
  @IsString()
  areaCode: string
  @IsString()
  @IsNotEmpty()
  agentId:string

} 
