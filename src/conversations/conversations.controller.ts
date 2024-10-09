import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { Response } from 'express';
import { UserAuthGuard } from 'src/auth/Guards/jwtStrategy';

@Controller({ path: 'conversations', version: '1' })
@UseGuards(UserAuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get('/:agentId')
  async getConversation(
    @Res() response: Response,
    @Param('agentId') agentId: string,
  ) {
    const result = await this.conversationsService.getAgentConvesation(agentId);
    return response
      .status(HttpStatus.OK)
      .json({ success: true, conversations: result });
  }

  @Get('transcript/:agentId/:conversationId')
  async getTranscripts(
    @Res() response: Response,
    @Param('agentId') agentId: string,
    @Param('conversationId') conversationId: string,
  ) {
    const result = await this.conversationsService.getConversationTranscript(
      agentId,
      conversationId,
    );
    return response
      .status(HttpStatus.OK)
      .json({ success: true, transcripts: result });
  }
}
