import { Controller, Get } from '@nestjs/common';
import { PlayHtService } from './play-ht.service';

@Controller({ path: 'play-ht' ,version:'1'})
export class PlayHtController {
  constructor(private readonly playHtService: PlayHtService) {}
  @Get('/prebuilt-voices')
  async getPreBuiltVoices() {
    return this.playHtService.getPrebuiltVoices();
  }
}
