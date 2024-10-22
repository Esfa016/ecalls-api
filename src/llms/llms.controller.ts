import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import { LlmsService } from './llms.service';
import { Response } from 'express';
import { UserAuthGuard } from 'src/auth/Guards/jwtStrategy';

@Controller({ path: 'llms', version: '1' })
export class LlmsController {
  constructor(private readonly llmsService: LlmsService) { }
  @UseGuards(UserAuthGuard)
  @Get('/models')
  async getModels(@Res() res: Response) {
    const result = await this.llmsService.getModels();
    return res.status(HttpStatus.OK).json({ success: true, llms: result });
  }
}
