// import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
// import { WebrtcService } from './webrtc.service';

// @Controller('webrtc')
// export class WebrtcController {
//   constructor(private readonly webrtcService: WebrtcService) {}

//   @Get('recordings/:conversationId')
//   async getRecording(@Param('conversationId') conversationId: string) {
//     return this.webrtcService.getRecording(conversationId);
//   }

//   @Get('recordings')
//   async getAllRecordings() {
//     return this.webrtcService.getAllRecordings();
//   }

//   @Post('recordings/:conversationId/stop')
//   async stopRecording(@Param('conversationId') conversationId: string) {
//     return this.webrtcService.finalizeRecording(conversationId);
//   }
// }