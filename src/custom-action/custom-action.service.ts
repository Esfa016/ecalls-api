import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CustomActions } from './Models/customActionsSchema';
import { Model } from 'mongoose';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ConfigService } from '@nestjs/config';
import { CreateCustomActionsDto } from './Validations/customActionsDTO';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { ErrorMessages } from 'src/Global/messages';
import { QueryParamsDTO } from 'src/Global/Validations/pagination';
import { PaginationHelper } from 'src/Global/helpers';

@Injectable()
export class CustomActionService {
  constructor(
    @InjectModel(CustomActions.name)
    private readonly repository: Model<CustomActions>,
    private readonly apiCallsService: ApiCallsService,
    private readonly configService: ConfigService,
  ) {}

  async createActions(body: CreateCustomActionsDto) {
    let createdAction: CustomActions | null = null;

    const response = await this.apiCallsService.sendGeneralRequest({
      uri: this.configService.get('playApiUrl') + `/api/v1/external-functions`,
      body: {
        method: body.method.toUpperCase(),
        name: body.name,
        description: body.description,
        endpointUrl: body.endpointUrl,
        headers: body.headers,
        params: body.params,
      },
      method: ACTION_VERBS.POST,
      headers: {
        AUTHORIZATION: this.configService.get('playSecretKey'),
        'X-USER-ID': this.configService.get('playUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });

    if (response.status === HttpStatus.CREATED) {
      const actionId: string = response.data.id;
      delete response.data.id;
      createdAction = await this.repository.create({
        actionId: actionId,

        ...response.data,
      });

      return createdAction;
    } else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError);
    }
  }

  async getAllActions(pagination: QueryParamsDTO) {
    const totalData: number = await this.repository.countDocuments();
    const data: CustomActions[] = await this.repository
      .find()
      .skip(PaginationHelper.paginateQuery(pagination))
      .limit(pagination.limit);
    return {
      totalData: totalData,
      customActions: data,
    };
  }
  async bindWithAgent(agentId: string, customActionId: string) {
    // try {
    //   const response = await this.apiCallsService.sendRequestToPlayAI({
    //     uri: `${this.configService.get('playApiUrl')}/api/v1/agents/${agentId}/actions/${customActionId}`,
    //     method: ACTION_VERBS.PATCH,
    //     body: {
    //       name: 'Kuantaw ziq ale',
    //       description: 'Fetch available appointment times for the user',
    //       endpoint: 'https://your-api.com/api/appointments',
    //     },
    //   });
    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }
  }
}
