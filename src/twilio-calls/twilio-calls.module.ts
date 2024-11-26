import { Module } from '@nestjs/common';
import { TwilioCallsController } from './twilio-calls.controller';
import { TwilioCallsService } from './twilio-calls.service';
import { TwilioModule } from "nestjs-twilio";

@Module({
  imports: [TwilioModule.forRoot({
    accountSid: process.env.TWILIO_SID,
    authToken:process.env.TWILIO_AUTH_TOKEN
  })],
  controllers: [TwilioCallsController],
  providers: [TwilioCallsService]
})
export class TwilioCallsModule {}
