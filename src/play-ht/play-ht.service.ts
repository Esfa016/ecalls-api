import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiCallsService } from 'src/api_calls/api_calls.service';
import { ACTION_VERBS } from 'src/api_calls/DTO/apiCallsDTO';
import { IClonedVoices, IPrebuiltVoice } from './Validations/voiceDTO';
import { ErrorMessages } from 'src/Global/messages';

@Injectable()
export class PlayHtService {
  constructor(
    private configService: ConfigService,
    private makeRequest: ApiCallsService,
  ) {}
  async getPrebuiltVoices() {
    let voices: IPrebuiltVoice[] | [];

    const response = await this.makeRequest.sendGeneralRequest({
      uri: this.configService.get('playHtBaseUrl') + '/voices',
      headers: {
        Authorization: this.configService.get('playHtSecretKey'),
        'X-USER-ID': this.configService.get('playHtUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
      method: ACTION_VERBS.GET,
    });
    if (response.status === HttpStatus.OK) {
      voices = response.data;
      return voices;
    } else {
      throw new InternalServerErrorException(ErrorMessages.InternalServerError);
    }
  }

  async getClonedVoices() {
    let voices:IClonedVoices|[]
    const response = await this.makeRequest.sendGeneralRequest({
      uri: this.configService.get('playHtBaseUrl') + '/cloned-voices',
      headers: {
        Authorization: this.configService.get('playHtSecretKey'),
        'X-USER-ID': this.configService.get('playHtUserId'),
        'content-type': 'application/json',
        accept: 'application/json',
      },
      method: ACTION_VERBS.GET,
    });
    if (response.status === HttpStatus.OK) {
      voices = response.data;
      return voices
    }
    else {
       throw new InternalServerErrorException(
         ErrorMessages.InternalServerError,
       );
    }
  }
}
