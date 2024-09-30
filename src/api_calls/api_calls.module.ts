import { Global, Module } from '@nestjs/common';
import { ApiCallsService } from './api_calls.service';

import { HttpModule } from '@nestjs/axios';

@Global()
@Module({
  imports:[HttpModule],
  controllers: [],
  providers: [ApiCallsService],
  exports:[ApiCallsService]
})
export class ApiCallsModule {}
