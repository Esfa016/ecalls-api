export interface IPrebuiltVoice {
  id: string;
  name: string;
  sample: string;
  accent: string;
  age: string;
  gender: string;
  language: string;
  language_code: string;
  loudness: string;
  style: string;
  tempo: string;
  texture: string;
  is_cloned: boolean;
  voice_engine: string;
}
export enum VoiceType {
    HIGH_FIDELITY = 'high-fidelity',
    INSTANT = 'instant'
}

export interface IClonedVoices{
    id: string,
    name: string,
    type:VoiceType
}
