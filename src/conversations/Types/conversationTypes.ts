export interface IConversation {
    id: string;
    source: string;
    callerEmail: string;
    startedAt: string;
    endedAt: string;
    durationInSecounds:301
}

export interface ITransacript {
    id: string;
    role: string;
    content: string;
    timestamp: string;
}