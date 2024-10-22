import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { IConversation, ITransacript } from './Types/conversationTypes';

@Injectable()
export class ConversationsService {
  constructor(
    private apiCalls: ApiCallsService,
    private configService: ConfigService,
  ) {}

  async getAgentConvesation(agentId: string) {
    const response = await this.apiCalls.sendRequestToPlayAI({
      uri:
        this.configService.get('playApiUrl') +
        `/api/v1/agents/${agentId}/conversations`,
      method: ACTION_VERBS.GET,
    });
    const data: IConversation[] | [] | null = response.data;
    return data;
  }

  async getConversationTranscript(agentId: string, conversationId: string) {
    const response = await this.apiCalls.sendRequestToPlayAI({
      uri:
        this.configService.get('playApiUrl') +
        `/api/v1/agents/${agentId}/conversations/${conversationId}/transcript`,
      method: ACTION_VERBS.GET,
    });
    const data: ITransacript | [] | null = response.data;
    return data;
  }
}
