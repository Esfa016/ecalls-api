import {
  Controller,
  Get,
  Post,
  Res,
  Body,
  Delete,
  Put,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { Response } from 'express';
import { CreateAgentDTO } from './DTO/agentDTO';
import { SuccessMessages } from 'src/Global/messages';
import { UserAuthGuard } from 'src/auth/Guards/jwtStrategy';
import { RbacGuard } from 'src/auth/Guards/RbacGuard';
import { AccountRoles } from 'src/Global/sharables';

@Controller({ version: '1', path: 'agents' })
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) { }
  @UseGuards(UserAuthGuard,new RbacGuard([AccountRoles.CLIENT]))
  @Post()
  async getSomething(@Res() res: Response, @Body() body: CreateAgentDTO) {
    const result = await this.agentsService.createAgents(body);
    return res
      .status(HttpStatus.CREATED)
      .json({
        success: true,
        message: SuccessMessages.SaveSuccessful,
        agent: result,
      });
  }
}
