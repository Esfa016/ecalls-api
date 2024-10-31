import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { PlayHtService } from './play-ht.service';
import { Response } from 'express';

@Controller({ path: 'play-ht', version: '1' })
export class PlayHtController {
  constructor(private readonly playHtService: PlayHtService) {}
  @Get('/prebuilt-voices')
  async getPreBuiltVoices(@Res() res: Response) {
    const result = await this.playHtService.getPrebuiltVoices();
   return res.status(HttpStatus.OK).json({ success: true, prebuiltVoices: result });
  }
  @Get('/cloned-voices')
  async getClonedVoices(@Res() res: Response) {
    const result = await this.playHtService.getClonedVoices()
    return res.status(HttpStatus.OK).json({success:true,clonedVoices:result})
  }
}
