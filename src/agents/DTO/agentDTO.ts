import {
  IsBoolean,
  IsString,
  IsNumber,
  IsEnum,
  ValidateNested,
  IsObject,
  IsNotEmpty,
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
}
