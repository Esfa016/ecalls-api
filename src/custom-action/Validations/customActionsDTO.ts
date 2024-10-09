import {
  IsDefined,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  Matches,
} from 'class-validator';
import { Headers } from '@nestjs/common';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
interface ActionParams {
  dynamicParam?: string;
  staticParam?: string;
}

export class CreateCustomActionsDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsUrl()
  @Matches(/^https:\/\//, {
    message: 'The endpoint must be a secure URL (starting with "https://")',
  })
  @IsNotEmpty()
  endpointUrl: string;
  @IsEnum(ACTION_VERBS)
  @IsNotEmpty()
  method: ACTION_VERBS;
  @IsOptional()
  @IsObject()
  headers: Headers;

  @IsOptional()
  @IsObject()
  @IsDefined()
  params: ActionParams;
}
