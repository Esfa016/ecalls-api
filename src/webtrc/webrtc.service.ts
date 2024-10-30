// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { promises as fs } from 'fs';
// import { join } from 'path';
// import { Agents } from 'src/agents/Models/agentSchema';

// @Injectable()
// export class WebrtcService {
//   private readonly audioFileBuffer: Buffer | null = null;

//   constructor(
//     @InjectModel(Agents.name) private agentModel: Model<Agents>
//   ) {
//     this.loadAudioFile();
//   }

//   private async loadAudioFile() {
//     try {
//       const filePath = join(process.cwd(), 'assets', 'Evillaugh.ogg');
//       this.audioFileBuffer = await fs.readFile(filePath);
//     } catch (error) {
//       console.error('Error loading audio file:', error);
//     }
//   }

//   async startNewRecording(agentId: string, conversationId: string) {
//     return await this.agentModel.findOneAndUpdate(
//       { agentId },
//       {
//         $push: {
//           conversationRecordings: {
//             conversationId,
//             startedAt: new Date(),
//             createdAt: new Date(),
//             audioData: Buffer.alloc(0),
//             duration: 0
//           }
//         }
//       }
//     );
//   }

//   async appendToRecording(conversationId: string, audioChunk: Buffer) {
//     const recording = await this.agentModel.findOne({
//       'conversationRecordings.conversationId': conversationId
//     });
    
//     if (!recording) return null;

//     const existingAudio = recording.conversationRecordings.find(
//       r => r.conversationId === conversationId
//     ).audioData;

//     const newAudio = Buffer.concat([existingAudio, audioChunk]);

//     await this.agentModel.updateOne(
//       { 'conversationRecordings.conversationId': conversationId },
//       {
//         $set: {
//           'conversationRecordings.$.audioData': newAudio
//         }
//       }
//     );
//   }

//   async finalizeRecording(conversationId: string) {
//     return await this.agentModel.updateOne(
//       { 'conversationRecordings.conversationId': conversationId },
//       {
//         $set: {
//           'conversationRecordings.$.endedAt': new Date()
//         }
//       }
//     );
//   }

//   async getRecording(conversationId: string) {
//     const agent = await this.agentModel.findOne({
//       'conversationRecordings.conversationId': conversationId
//     });
//     return agent?.conversationRecordings.find(r => r.conversationId === conversationId);
//   }

//   async getAllRecordings() {
//     const agents = await this.agentModel.find({
//       'conversationRecordings.0': { $exists: true }
//     });
//     return agents.flatMap(agent => agent.conversationRecordings);
//   }

//   getStaticAudioBuffer() {
//     return this.audioFileBuffer;
//   }
// }