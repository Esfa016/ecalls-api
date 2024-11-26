import {
  Controller,
  Post,
  Body,
  UseGuards,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { TwilioCallsService } from './twilio-calls.service';
import { Response } from 'express';
import { MakeTwilioCallsDTO } from './Validations/twilioCallsDTO';
import { SuccessMessages } from 'src/Global/messages';

@Controller({ path: 'twilio-calls' ,version:'1'})
export class TwilioCallsController {
  constructor(private twilioService: TwilioCallsService) {}
  @Post('make-twilio-call')
  async createTwilioService(
    @Res() res: Response,
    @Body() body: MakeTwilioCallsDTO,
  ) {
    const result = await this.twilioService.createTwilioCalls(body);
    return res.status(HttpStatus.OK).json({
      success: true,
      message: SuccessMessages.SaveSuccessful,
      result: result,
    });
  }
}
