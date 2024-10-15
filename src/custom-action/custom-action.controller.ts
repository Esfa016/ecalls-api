import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  UseGuards,
  Body,
  Res,
  HttpStatus,
  Query,
  Patch,
  Param,
} from '@nestjs/common';
import { CustomActionService } from './custom-action.service';
import { Response } from 'express';
import { CreateCustomActionsDto } from './Validations/customActionsDTO';
import { SuccessMessages } from 'src/Global/messages';
import { UserAuthGuard } from 'src/auth/Guards/jwtStrategy';
import { QueryParamsDTO } from 'src/Global/Validations/pagination';

@Controller({ version: '1', path: 'custom-action' })
export class CustomActionController {
  constructor(private readonly customActionService: CustomActionService) {}
  @UseGuards(UserAuthGuard)
  @Post()
  async createActions(
    @Res() res: Response,
    @Body() body: CreateCustomActionsDto,
  ) {
    const result = await this.customActionService.createActions(body);
    return res.status(HttpStatus.CREATED).json({
      success: true,
      message: SuccessMessages.SaveSuccessful,
      customAction: result,
    });
  }
  @UseGuards(UserAuthGuard)
  @Get()
  async getActions(@Res() res: Response, @Query() query: QueryParamsDTO) {
    const result = await this.customActionService.getAllActions(query);
    return res.status(HttpStatus.OK).json(result);
  }

  @UseGuards(UserAuthGuard)
  @Patch('/bind/:agentId/:customActionId')
  async bindWithAction(@Res() res: Response, @Param('agentId') agentId: string, @Param('customActionId') customActionId: string) {
    const result = await this.customActionService.bindWithAgent(agentId,customActionId)
  }
}
