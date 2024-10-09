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
  Query,
  Param,
} from '@nestjs/common';
import { AgentsService } from './agents.service';
import { Response } from 'express';
import { CreateAgentDTO } from './DTO/agentDTO';
import { SuccessMessages } from 'src/Global/messages';
import { UserAuthGuard } from 'src/auth/Guards/jwtStrategy';
import { RbacGuard } from 'src/auth/Guards/RbacGuard';
import { AccountRoles } from 'src/Global/sharables';
import { QueryParamsDTO } from 'src/Global/Validations/pagination';

@Controller({ version: '1', path: 'agents' })
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}
  @UseGuards(UserAuthGuard)
  @Post()
  async createAgents(@Res() res: Response, @Body() body: CreateAgentDTO) {
    const result = await this.agentsService.createAgents(body);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessages.SaveSuccessful,
      agent: result,
    });
  }
  @UseGuards(UserAuthGuard)
  @Get()
  async getAgents(@Res() res: Response, @Query() pagination: QueryParamsDTO) {
    const result = await this.agentsService.getAllAgents(pagination);
    return res
      .status(HttpStatus.OK)
      .json({
        success: true,
        totalData: result.totalData,
        agents: result.agents,
      });
  }

  @UseGuards(UserAuthGuard)
  @Get("/:agentId")
  async getAgentById(@Res() res:Response,@Param('agentId') agentId: string) {
    const result = await this.agentsService.getAgentByAgentId(agentId)
    return res.status(HttpStatus.OK).json({success:true,agent:result})
  }
}
