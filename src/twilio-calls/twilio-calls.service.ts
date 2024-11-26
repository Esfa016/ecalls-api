import { Injectable } from '@nestjs/common';
import { TwilioService } from 'nestjs-twilio';
import { ITwilioCallResponse, MakeTwilioCallsDTO } from './Validations/twilioCallsDTO';
import { CallInstance } from 'twilio/lib/rest/insights/v1/call';

@Injectable()
export class TwilioCallsService {
  public constructor(private readonly twilioService: TwilioService) {}

    async createTwilioCalls(body: MakeTwilioCallsDTO) {
    
   const response = await this.twilioService.client.calls.create({
      from: body.from,
      to: body.to,
      url: body.url,
   });
    
      const data: ITwilioCallResponse = response as unknown as ITwilioCallResponse;
      return data;
  }
}
