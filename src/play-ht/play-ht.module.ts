import { Module } from '@nestjs/common';
import { PlayHtService } from './play-ht.service';
import { PlayHtController } from './play-ht.controller';

@Module({
  controllers: [PlayHtController],
  providers: [PlayHtService],
})
export class PlayHtModule {}
