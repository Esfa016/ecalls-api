import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CallersService } from './callers.service';
import { Response } from 'express';
import { BuyPhoneNumberDTO } from './Validations/callersDTO';
import { SuccessMessages } from 'src/Global/messages';

@Controller({ version: '1', path: 'callers' })
export class CallersController {
  constructor(private readonly callersService: CallersService) {}
  @Post('buy-phone-number-bulk-vs')
  async buyPhoneNumber(@Res() res: Response, @Body() body: BuyPhoneNumberDTO) {
    const result = await this.callersService.buyPhoneNumber(body);
    return res
      .status(HttpStatus.CREATED)
      .json({
        success: true,
        message: SuccessMessages.SaveSuccessful,
        data: result,
      });
  }
}
