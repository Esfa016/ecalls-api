import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ACTION_VERBS, MakeRequestDTO } from './DTO/apiCallsDTO';
import * as axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiCallsService {
  constructor(private configService: ConfigService) {}

  // sendRequestToPlayAI(data: MakeRequestDTO) {
  //   switch (data.method) {
  //     case ACTION_VERBS.POST: {
  //       return axios.default({
  //         url: data.uri,
  //         method: ACTION_VERBS.POST,
  //         data: data.body,
  //         headers: {
  //           AUTHORIZATION: this.configService.get('playSecretKey'),
  //           'X-USER-ID': this.configService.get('playUserId'),
  //           'content-type': 'application/json',
  //           accept: 'application/json',
  //         },
  //       });
  //     }
  //     case ACTION_VERBS.GET: {
  //       return axios.default({
  //         url: data.uri,
  //         method: ACTION_VERBS.GET,
  //         headers: {
  //           AUTHORIZATION: this.configService.get('playSecretKey'),
  //           'X-USER-ID': this.configService.get('playUserId'),
  //           'content-type': 'application/json',
  //           accept: 'application/json',
  //         },
  //       });
  //     }
  //     case ACTION_VERBS.PUT: {
  //       return axios.default({
  //         url: data.uri,
  //         method: ACTION_VERBS.PUT,
  //         data: data.body,
  //         headers: {
  //           AUTHORIZATION: this.configService.get('playSecretKey'),
  //           'X-USER-ID': this.configService.get('playUserId'),
  //           'content-type': 'application/json',
  //           accept: 'application/json',
  //         },
  //       });
  //     }
  //     case ACTION_VERBS.PATCH: {
  //       return axios.default({
  //         url: data.uri,
  //         method: ACTION_VERBS.PATCH,
  //         data: data.body,
  //         headers: {
  //           AUTHORIZATION: this.configService.get('playSecretKey'),
  //           'X-USER-ID': this.configService.get('playUserId'),
  //           'content-type': 'application/json',
  //           accept: 'application/json',
  //         },
  //       });
  //     }

  //     case ACTION_VERBS.DELETE: {
  //       return axios.default({
  //         url: data.uri,
  //         method: ACTION_VERBS.DELETE,

  //         headers: {
  //           AUTHORIZATION: this.configService.get('playSecretKey'),
  //           'X-USER-ID': this.configService.get('playUserId'),
  //           'content-type': 'application/json',
  //           accept: 'application/json',
  //         },
  //       });
  //     }
  //   }
  // }
  sendGeneralRequest(data: MakeRequestDTO) {
    
    switch (data.method) {
      case ACTION_VERBS.POST: {
        return axios.default({
          url: data.uri,
          method: ACTION_VERBS.POST,
          data: data.body,
          headers: data.headers,
        });
      }
      case ACTION_VERBS.GET: {
        return axios.default({
          url: data.uri,
          method: ACTION_VERBS.GET,
          headers:data.headers,
        });
      }
      case ACTION_VERBS.PUT: {
        return axios.default({
          url: data.uri,
          method: ACTION_VERBS.PUT,
          data: data.body,
          headers: data.headers,
        });
      }
      case ACTION_VERBS.PATCH: {
        return axios.default({
          url: data.uri,
          method: ACTION_VERBS.PATCH,
          data: data.body,
          headers: data.headers,
        });
      }

      case ACTION_VERBS.DELETE: {
        return axios.default({
          url: data.uri,
          method: ACTION_VERBS.DELETE,

          headers: data.headers,
        });
      }
    }
  }
}
