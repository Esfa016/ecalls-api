import { IsNotEmpty, IsPhoneNumber, IsUrl } from "class-validator";

export class MakeTwilioCallsDTO {
    @IsPhoneNumber()
    @IsNotEmpty()
    from: string
     @IsPhoneNumber()
    @IsNotEmpty()
    to: string
    @IsUrl()
    @IsNotEmpty()
    url:string
    
}
export enum CallDirection {
  INBOUND = 'inbound',
  OUTBOUND_API = 'outbound-api',
  OUTBOUND_DIAL = 'outbound-dial',
}

export enum CallStatus {
  QUEUED = 'queued',
  INITIATED = 'initiated',
  RINGING = 'ringing',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  BUSY = 'busy',
  FAILED = 'failed',
  NO_ANSWER = 'no-answer',
  CANCELED = 'canceled',
}

export interface ITwilioCallResponse {
  accountSid: string;
  annotation?: string;
  answeredBy?: string;
  apiVersion: string;
  callerName?: string;
  dateCreated: Date | string;
  dateUpdated: Date | string;
  direction: CallDirection | string;
  duration: string;
  endTime: Date | string;
  forwardedFrom?: string;
  from: string;
  fromFormatted: string;
  groupSid?: string;
  parentCallSid?: string;
  phoneNumberSid: string;
  price: string;
  priceUnit: string;
  sid: string;
  startTime: Date | string;
  status: CallStatus;
  subresourceUris: {
    notifications: string;
    recordings: string;
    payments: string;
    events: string;
    siprec: string;
    streams: string;
    transcriptions: string;
    userDefinedMessageSubscriptions: string;
    userDefinedMessages: string;
  };
  to: string;
  toFormatted: string;
  trunkSid?: string;
  uri: string;
  queueTime: string;
}
