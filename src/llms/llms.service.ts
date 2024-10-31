import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { IModelType } from './Types/llmTypes';
import { ErrorMessages } from 'src/Global/messages';

@Injectable()
export class LlmsService {
  constructor(
    private configService: ConfigService,
    private apiCallsService: ApiCallsService,
  ) {}

  async getModels() {
    let models: IModelType[] | null;
    const response = await this.apiCallsService.sendGeneralRequest({
      method: ACTION_VERBS.GET,
      uri: this.configService.get('aimlBaseUrl') + '/models',
      headers: {
        Authorization: `Bearer ${this.configService.get('aimlApi')}`,
      },
    });
    if (response.status === HttpStatus.OK) {
        models = response.data['data'];
      return models;
    } else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError);
    }
  }
}

