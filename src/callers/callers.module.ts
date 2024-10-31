import { Module } from '@nestjs/common';
import { CallersService } from './callers.service';
import { CallersController } from './callers.controller';

@Module({
  controllers: [CallersController],
  providers: [CallersService],
})
export class CallersModule {}
