import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Agents } from './Models/agentSchema';
import { Model } from 'mongoose';
import { CreateAgentDTO } from './DTO/agentDTO';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { ConfigService } from '@nestjs/config';
import { currentUser } from 'src/Global/sharables';
import { QueryParamsDTO } from 'src/Global/Validations/pagination';
import { PaginationHelper } from 'src/Global/helpers';

@Injectable()
export class AgentsService {
  constructor(
    @InjectModel(Agents.name) private readonly repository: Model<Agents>,
    private readonly apiCallService: ApiCallsService,
    private configService: ConfigService,
  ) {}

  async createAgents(body: CreateAgentDTO) {
    const response =await this.apiCallService.sendRequest({
      uri: this.configService.get('playApiUrl') + '/api/v1/agents',
      method: ACTION_VERBS.POST,
      body: body,
    });
    delete(response.data.id)
    const agent: Agents = await this.repository.create({ ...response.data, createdBy: currentUser.id })
    return agent
  }
  async getAllAgents(pagination: QueryParamsDTO) {
    const totalData:number = await this.repository.countDocuments()
    const data: Agents[] = await this.repository.find().skip(PaginationHelper.paginateQuery(pagination)).limit(pagination.limit)
    return {
      totalData: totalData,
      agents:data
    }
  }
  
  
}