import {
  Catch,
  ArgumentsHost,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import mongoose from 'mongoose';

import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ErrorMessages } from './messages';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      const message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || 'An error occurred';

      if (status !== HttpStatus.INTERNAL_SERVER_ERROR) {
        this.logger.warn(`HTTP Exception: ${message}`, exception.stack);

        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
        });
      } else {
        this.logger.error('Internal Server Error:', exception.stack);

        response.status(status).json({
          statusCode: status,
          timestamp: new Date().toISOString(),
          path: request.url,
          message: ErrorMessages.InternalServerError,
        });
      }
    } else if ((exception as any).isAxiosError) {
      const axiosError = exception as any;
      const status =
        axiosError.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message =
        axiosError.response?.data?.message ||
        axiosError.message ||
        'API request error';

      this.logger.error(`Axios Error: ${message}`, axiosError.stack);
this.logger.error(exception)
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message,
        details: axiosError.response?.data || null,
      });
    } else {
      this.logger.error('Unhandled Exception:', exception);

      response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: ErrorMessages.InternalServerError,
      });
    }

    super.catch(exception, host);
  }
}

export enum AccountRoles {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
}

export interface UserAccount {
  id: mongoose.Schema.Types.ObjectId;
  role: AccountRoles;
  email: string;
  fullName: string;
}
export var currentUser: UserAccount | null = null;
export const setCurrentUser = (user: UserAccount) => {
  currentUser = user;
};
