/**
 * Microphone recorder for streaming 16kHz PCM audio to Gemini Live API
 */
import { floatTo16BitPCM, arrayBufferToBase64 } from './audioStreamer.ts';

export class LiveMicRecorder {
  private stream: MediaStream | null = null;
  private audioCtx: AudioContext | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private analyser: AnalyserNode | null = null;
  private onAudioChunk: (base64Pcm: string) => void;
  private isRecording = false;

  constructor(onAudioChunk: (base64Pcm: string) => void) {
    this.onAudioChunk = onAudioChunk;
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public getIsRecording(): boolean {
    return this.isRecording;
  }

  public async start(): Promise<void> {
    if (this.isRecording) return;

    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        sampleRate: 16000,
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    this.audioCtx = new AudioCtxClass({ sampleRate: 16000 });
    this.source = this.audioCtx.createMediaStreamSource(this.stream);

    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 256;
    this.source.connect(this.analyser);

    // Buffer size 2048 or 4096 gives smooth ~128ms - 256ms audio packet intervals
    this.processor = this.audioCtx.createScriptProcessor(4096, 1, 1);
    this.source.connect(this.processor);
    this.processor.connect(this.audioCtx.destination);

    this.processor.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      const pcm16 = floatTo16BitPCM(inputData);
      const base64 = arrayBufferToBase64(pcm16);
      this.onAudioChunk(base64);
    };

    this.isRecording = true;
  }

  public stop(): void {
    this.isRecording = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor.onaudioprocess = null;
      this.processor = null;
    }

    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }

    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }

    if (this.audioCtx && this.audioCtx.state !== 'closed') {
      this.audioCtx.close().catch(() => {});
      this.audioCtx = null;
    }
  }
}
