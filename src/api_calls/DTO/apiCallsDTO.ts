import { AxiosHeaders, AxiosRequestConfig, RawAxiosRequestHeaders } from 'axios';
import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
export enum ACTION_VERBS {
  POST = 'post',
  GET = 'get',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export interface MakeRequestDTO {
  uri: string;

  body?: object;

  method: ACTION_VERBS;

  config?: AxiosRequestConfig;
  headers: RawAxiosRequestHeaders
}
