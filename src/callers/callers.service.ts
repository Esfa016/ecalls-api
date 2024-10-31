import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { BuyPhoneNumberDTO } from './Validations/callersDTO';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';

@Injectable()
export class CallersService {
  constructor(
    private configService: ConfigService,
    private apiCallsService: ApiCallsService,
  ) {}

  async buyPhoneNumber(body: BuyPhoneNumberDTO) {
    const response = await this.apiCallsService.sendGeneralRequest({
      uri: this.configService.get('bulkVsUrl') + '/orderIn',
      headers: {
        Authorization: `Bearer ${this.configService.get('bulkVsApiKey')}`,
      },
      method: ACTION_VERBS.POST,
      body: {
        TN: body.TN,
        Lidb: body.Lidb,
        'Portout Pin': body.portoutPin,
        ReferenceID: body.referenceID,
        'Trunk Group': body.trunkGroup,
        Sms: body.Sms,
        Mms: body.Mms,
        Webhook: body.Webhook,
      },
    });
    const data:BuyPhoneNumberDTO = JSON.parse( response.config.data)
    return data;
  }
}
