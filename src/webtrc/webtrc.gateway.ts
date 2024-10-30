/* eslint-disable prettier/prettier */

// process.env.AIML_API

import { 
    WebSocketGateway, 
    WebSocketServer, 
    SubscribeMessage 
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Agents } from 'src/agents/Models/agentSchema';
import axios from 'axios';
import {fetch} from 'cross-fetch'
import {  createClient, LiveTranscriptionEvents } from '@deepgram/sdk';

interface AudioChunk {
    timestamp: Date;
    audio: Buffer;
    source: 'user' | 'agent';
}

interface AudioSession {
    isRecording: boolean;
    isProcessing: boolean;
    isCurrentlySpeaking: boolean;
    lastSpeechTimestamp: Date;
    silenceDuration: number;
    conversationId: Types.ObjectId;
    startTime: Date;
    audioChunks: AudioChunk[];
    deepgramLive?: any;
    lastTranscript: string;
    transcripts: Array<{
        text: string;
        timestamp: Date;
        source: 'user' | 'agent';
    }>;
}

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    transports: ['websocket'],
})
export class WebrtcGateway {
    @WebSocketServer()
    server: Server;

    private sessions: Map<string, AudioSession> = new Map();
    private readonly SILENCE_THRESHOLD = 2000; // 2 seconds of silence
    private readonly deepgram;

    constructor(
        @InjectModel(Agents.name) private agentModel: Model<Agents>
    ) {
        this.deepgram =  createClient(process.env.DEEPGRAM_API_KEY);
    }

    

    private async getAgentById(agentId: string): Promise<Agents | null> {
        try {
            const agent = await this.agentModel.findOne({ _id: agentId }).exec();
            return agent;
        } catch (error) {
            console.error('Error fetching agent:', error);
            throw new Error('Could not fetch agent');
        }
    }

    private async initializeDeepgram(clientId: string) {
        const session = this.sessions.get(clientId);
        const url = "http://stream.live.vc.bbcmedia.co.uk/bbc_world_service";

        if (!session) return;

        try {
            // Create a new live transcription project
            const deepgramLive = await this.deepgram.listen.live({
                model: "nova-2",
                language: "en-US",
                smart_format: true,
                encoding: "linear16",    // Specify PCM-16 encoding
                sample_rate: 16000,      // Specify 16kHz sample rate
                channels: 1,   
              
            });
            console.log('deepgram initialized');
            // console.log(deepgramLive);

            deepgramLive.on(LiveTranscriptionEvents.Open, () => {
                // console.log(data);
                console.log('here is data on open');
                deepgramLive.on(LiveTranscriptionEvents.Close, () => {
                  console.log("deepgramLive closed.");
                });
            
                deepgramLive.on(LiveTranscriptionEvents.Transcript, (data) => {
                this.handleTranscription(clientId, data);
                  console.log(data.channel.alternatives[0].transcript, 'this supposed to be the transcript');
                  console.log(data.channel, 'here is the whole data ');
                });
            

                deepgramLive.on(LiveTranscriptionEvents.Metadata, (data) => {
                  console.log(data, 'and this is the metadata');
                });
            
                deepgramLive.on(LiveTranscriptionEvents.Error, (err) => {
                  console.error(err, 'and this is the error ');
                });

                // fetch(url)
                // .then((r) => r.body as any)
                // .then((res) => {
                // res.on("readable", () => {
                // deepgramLive.send(res.read());
                //     });
                // });
            })

            session.deepgramLive = deepgramLive;
            return deepgramLive;

        } catch (error) {
            console.error('Error initializing Deepgram:', error);
            throw error;
        }
    }

    private handleSpeechStart(clientId: string) {
        const session = this.sessions.get(clientId);
        if (!session) return;

        session.isCurrentlySpeaking = true;
        session.lastSpeechTimestamp = new Date();
        session.silenceDuration = 0;

        const client = this.server.sockets.sockets.get(clientId);
        if (client) {
            client.emit('speechStatus', { 
                status: 'speaking',
                timestamp: new Date()
            });
        }
    }

    private handleSpeechEnd(clientId: string) {
        const session = this.sessions.get(clientId);
        if (!session) return;

        session.isCurrentlySpeaking = false;
        
        // Start monitoring for silence threshold
        this.startSilenceMonitoring(clientId);

        const client = this.server.sockets.sockets.get(clientId);
        if (client) {
            client.emit('speechStatus', { 
                status: 'silence',
                timestamp: new Date()
            });
        }
    }


    private handleSpeechDetection(clientId: string, session: AudioSession) {
        // Check if the user is currently speaking
        if (session.audioChunks.length > 0) {
            const lastChunk = session.audioChunks[session.audioChunks.length - 1];
            const currentTime = new Date();
            const silenceDuration = currentTime.getTime() - lastChunk.timestamp.getTime();

            if (silenceDuration <= this.SILENCE_THRESHOLD) {
                // User is currently speaking
                this.handleSpeechStart(clientId);
            } else {
                // User has stopped speaking
                this.handleSpeechEnd(clientId);
            }
        }
    }

    private startSilenceMonitoring(clientId: string) {
        const session = this.sessions.get(clientId);
        if (!session || session.isProcessing) return;

        const currentTime = new Date();
        const silenceDuration = currentTime.getTime() - session.lastSpeechTimestamp.getTime();

        if (silenceDuration >= this.SILENCE_THRESHOLD && !session.isProcessing) {
            // Process the mock response after silence threshold is met
            this.mockStreamText(clientId);
        }
    }

    private handleTranscription(clientId: string, transcription: any) {
        const session = this.sessions.get(clientId);
        if (!session) return;

        const result = transcription.channel?.alternatives?.[0];
        if (!result) return;

        // Update the transcript immediately without waiting for silence
        session.lastTranscript = result.transcript;
        session.transcripts.push({
            text: result.transcript,
            timestamp: new Date(),
            source: 'user'
        });

        const client = this.server.sockets.sockets.get(clientId);
        if (client) {
            client.emit('transcription', {
                transcript: result.transcript,
                isFinal: !transcription.speech_final,
                confidence: result.confidence,
                timestamp: new Date(),
                source: 'user'
            });
        }
    }

    private async mockStreamText(clientId: string): Promise<void> {
        const session = this.sessions.get(clientId);
        if (!session || !session.isRecording || session.isProcessing) return;

        session.isProcessing = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            const mockText = 'Hello thank you for calling ecalls how can i help you?';
            
            // Add agent response to transcripts
            session.transcripts.push({
                text: mockText,
                timestamp: new Date(),
                source: 'agent'
            });
            
            await this.streamGeneratedSpeech(clientId, mockText);
        } catch (error) {
            console.error('Error in mockStreamText:', error);
        } finally {
            session.isProcessing = false;
        }
    }

    private async streamGeneratedSpeech(clientId: string, text: string) {
        try {
            console.log('Processing text chunk:', text);
            const client = this.server.sockets.sockets.get(clientId);
            const session = this.sessions.get(clientId);
            
            if (!client || !session) {
                console.error(!client ? 'Client not found' : 'Session not found');
                return;
            }

            const agentId = client.handshake.query.agentId as string;
            const agent = await this.getAgentById(agentId);

            const response = await axios.post(
                'https://api.play.ht/api/v2/tts/stream',
                {
                    text,
                    voice: 's3://voice-cloning-zero-shot/d9ff78ba-d016-47f6-b0ef-dd630f59414e/female-cs/manifest.json',
                    output_format: 'mp3',
                    sample_rate: 24000,
                    speed: agent.voiceSpeed
                },
                {
                    headers: {
                        'Authorization': 'Bearer 55abc4b7c8c34c2780c602ca39fb60a4',
                        'X-User-ID': '8T5fOR7Am9PI8GyPFk1FZINE8FK2',
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            const audioBuffer = Buffer.from(response.data);

            session.audioChunks.push({
                timestamp: new Date(),
                audio: audioBuffer,
                source: 'agent'
            });

            client.emit('audioEcho', audioBuffer);
            console.log('Audio processed and sent to client');

        } catch (error) {
            console.error('Error in streamGeneratedSpeech:', error);
        }
    }


    @SubscribeMessage('audioData')
    async handleAudioData(client: Socket, payload: ArrayBuffer) {
        const session = this.sessions.get(client.id);
        if (!session || !session.isRecording) return;

        try {
            // Store audio chunk
            session.audioChunks.push({
                timestamp: new Date(),
                audio: Buffer.from(payload),
                source: 'user'
            });

              if (session.deepgramLive) {
                // console.log(Buffer.from(payload), 'buffer data that being sent');
                session.deepgramLive.send(Buffer.from(payload));
            } else {
                // Initialize Deepgram connection if it hasn't been done yet
                await this.initializeDeepgram(client.id);
            }

            // Handle speech start and end
            this.handleSpeechDetection(client.id, session);

        } catch (error) {
            console.error('Error in handleAudioData:', error);
        }
    }

    @SubscribeMessage('startConversation')
    handleStartConversation(client: Socket) {
        console.log(`Starting conversation for client: ${client.id}`);
        const conversationId = new Types.ObjectId();
        console.log(process.env.DEEPGRAM_API_KEY,'here is the key');
        this.sessions.set(client.id, {
            isRecording: true,
            isProcessing: false,
            isCurrentlySpeaking: false,
            lastSpeechTimestamp: new Date(),
            silenceDuration: 0,
            conversationId,
            startTime: new Date(),
            audioChunks: [],
            lastTranscript: '',
            transcripts: []
        });

        // Initialize Deepgram connection
        this.initializeDeepgram(client.id);
        
        client.emit('conversationStarted', { 
            conversationId: conversationId.toString() 
        });
    }

    @SubscribeMessage('stopConversation')
    async handleStopConversation(client: Socket) {
        const session = this.sessions.get(client.id);
        if (!session) return;

        // Close Deepgram connection if it exists
        if (session.deepgramLive) {
            session.deepgramLive.finish();
        }

        session.isRecording = false;
        
        try {
            const agentId = client.handshake.query.agentId as string;
            await this.saveConversation(
                agentId,
                session.conversationId,
                session.audioChunks,
                session.transcripts
            );
        } catch (error) {
            console.error('Error saving conversation:', error);
        }

        this.sessions.delete(client.id);
        client.emit('conversationStopped');
    }

    private async saveConversation(
        agentId: string, 
        conversationId: Types.ObjectId,
        audioChunks: AudioChunk[],
        transcripts: Array<{ text: string; timestamp: Date; source: 'user' | 'agent' }>
    ) {
        try {
            const sortedChunks = audioChunks.sort((a, b) => 
                a.timestamp.getTime() - b.timestamp.getTime()
            );

            const combinedAudio = Buffer.concat(sortedChunks.map(chunk => chunk.audio));

            const duration = Math.floor(
                (sortedChunks[sortedChunks.length - 1].timestamp.getTime() - 
                sortedChunks[0].timestamp.getTime()) / 1000
            );

            const conversation = {
                conversationId: conversationId,
                startedAt: sortedChunks[0].timestamp,
                endedAt: sortedChunks[sortedChunks.length - 1].timestamp,
                createdAt: new Date(),
                audioData: combinedAudio,
                duration: duration,
                transcripts: transcripts.map(t => ({
                    text: t.text,
                    timestamp: t.timestamp,
                    source: t.source
                }))
            };

            await this.agentModel.updateOne(
                { _id: agentId },
                { 
                    $push: { 
                        conversations: conversation 
                    } 
                }
            );

            console.log(`Conversation saved. Duration: ${duration}s, Transcript count: ${transcripts.length}`);
        } catch (error) {
            console.error('Error saving conversation:', error);
            throw error;
        }
    }
}