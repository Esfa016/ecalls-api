import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agents } from './Models/agentSchema';
import { Model } from 'mongoose';
import { CreateAgentDTO, IAgentStats, UpdateAgentDTO } from './DTO/agentDTO';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { ConfigService } from '@nestjs/config';
import { AccountRoles, currentUser } from 'src/Global/sharables';
import { QueryParamsDTO } from 'src/Global/Validations/pagination';
import { PaginationHelper } from 'src/Global/helpers';
import { ErrorMessages } from 'src/Global/messages';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agents.name) private readonly repository: Model<Agents>,
    private readonly apiCallService: ApiCallsService,
    private configService: ConfigService,
  ) {}

  async createAgents(body: CreateAgentDTO) {
    const response = await this.apiCallService.sendGeneralRequest({
      uri: this.configService.get('playApiUrl') + '/api/v1/agents',
      method: ACTION_VERBS.POST,
      body: body,
      headers: {
        AUTHORIZATION: this.configService.get('playSecretKey'),
        'X-USER-ID': this.configService.get('playUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    if (response.status === HttpStatus.CREATED) {
      const agentId = response.data.id;
      delete response.data.id;
      const agent: Agents = await this.repository.create({
        ...response.data,
        createdBy: currentUser.id,
        agentId: agentId,
      });
      return agent;
    } else {
      console.log(response.status);
      throw new InternalServerErrorException(ErrorMessages.InternalServerError);
    }
  }
  async getAllAgents(pagination: QueryParamsDTO) {
    const query =
      currentUser.role === AccountRoles.CLIENT
        ? { createdBy: currentUser.id }
        : {};
    const totalData: number = await this.repository.countDocuments(query);
    const data: Agents[] = await this.repository
      .find(query)
      .skip(PaginationHelper.paginateQuery(pagination))
      .limit(pagination.limit);
    return {
      totalData: totalData,
      agents: data,
    };
  }

  getAgentByAgentId(agentId: string) {
    return this.repository.findOne({ agentId: agentId });
  }

  async editAgent(agentId: string, body: UpdateAgentDTO) {
    let agentFound: Agents = await this.getAgentByAgentId(agentId);
    if (!agentFound) throw new NotFoundException(ErrorMessages.AgentNotFound);
    const response = await this.apiCallService.sendGeneralRequest({
      uri: this.configService.get('playApiUrl') + `/api/v1/agents/${agentId}`,
      method: ACTION_VERBS.PATCH,
      body: body,
      headers: {
        AUTHORIZATION: this.configService.get('playSecretKey'),
        'X-USER-ID': this.configService.get('playUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    if (response.status === HttpStatus.OK) {
      agentFound = await this.repository.findOneAndUpdate(
        { agentId: agentId },
        body,
        { new: true },
      );
    } else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError);
    }
    return agentFound;
  }
  async getAgentStats(agentId: string) {
    const response = await this.apiCallService.sendGeneralRequest({
      uri:
        this.configService.get('playApiUrl') + `/api/v1/agent-stats/${agentId}`,
      method: ACTION_VERBS.GET,
      headers: {
        AUTHORIZATION: this.configService.get('playSecretKey'),
        'X-USER-ID': this.configService.get('playUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    if (response.status === HttpStatus.OK) {
      const data: IAgentStats = response.data;
      return data;
    } else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError);
    }
  }
}
