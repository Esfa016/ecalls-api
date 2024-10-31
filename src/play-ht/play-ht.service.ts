import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';

@Injectable()
export class PlayHtService {
  constructor(
    private configService: ConfigService,
    private makeRequest: ApiCallsService,
  ) {}
    async getPrebuiltVoices() {
        try {
            console.log(this.configService.get('playHtUserId'))
            console.log(this.configService.get('playHtSecretKey'));
            const response = await this.makeRequest.sendGeneralRequest({
              uri: this.configService.get('playHtBaseUrl') + '/voices',
              headers: {
                Authorization: '5c017e7855444fb39df2497c7e27b0f6',
                'X-USER-ID': 'Kz41IMEif9TGWTsCGNxwi45fek33',
                'content-type': 'application/json',
                accept: 'application/json',
              },
              method: ACTION_VERBS.GET,
            });
            console.log(response.headers);
        }
        catch (err) {
            console.log(err)
        }
  }
}