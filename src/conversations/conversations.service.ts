import { HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { IConversation, ITransacript } from './Types/conversationTypes';
import { ErrorMessages } from 'src/Global/messages';

@Injectable()
export class ConversationsService {
  constructor(
    private apiCalls: ApiCallsService,
    private configService: ConfigService,
  ) {}

  async getAgentConvesation(agentId: string) {
    let conversations:IConversation[]|[]
    const response = await this.apiCalls.sendGeneralRequest({
      uri:
        this.configService.get('playApiUrl') +
        `/api/v1/agents/${agentId}/conversations`,
      method: ACTION_VERBS.GET,
      headers: {
        AUTHORIZATION: this.configService.get('playSecretKey'),
        'X-USER-ID': this.configService.get('playUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    if (response.status === HttpStatus.OK) {
      conversations = response.data;
      return conversations
    }
    else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError)
    }
    
  }

  async getConversationTranscript(agentId: string, conversationId: string) {
    let transcripts:ITransacript[]|[]
    const response = await this.apiCalls.sendGeneralRequest({
      uri:
        this.configService.get('playApiUrl') +
        `/api/v1/agents/${agentId}/conversations/${conversationId}/transcript`,
      method: ACTION_VERBS.GET,
      headers: {
        AUTHORIZATION: this.configService.get('playSecretKey'),
        'X-USER-ID': this.configService.get('playUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
    });
    if (response.status === HttpStatus.OK) {
      transcripts = response.data;
      return transcripts
    }
    else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError)
    }
  }
}
