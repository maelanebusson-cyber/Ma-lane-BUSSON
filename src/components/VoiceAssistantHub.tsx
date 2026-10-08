import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  Send,
  RotateCcw,
  Languages,
  Radio,
  Sliders,
  CheckCircle,
  HelpCircle,
  AlertCircle,
} from 'lucide-react';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer.tsx';
import { LiveAudioPlayer } from '../utils/audioStreamer.ts';
import { LiveMicRecorder } from '../utils/micRecorder.ts';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  audioBlobUrl?: string;
}

interface VoiceAssistantHubProps {
  lang: 'en' | 'fr';
  setLang: (lang: 'en' | 'fr') => void;
  onSendExternalQuery?: (query: string) => void;
  externalQuery?: string;
  onClearExternalQuery?: () => void;
}

export const VoiceAssistantHub: React.FC<VoiceAssistantHubProps> = ({
  lang,
  setLang,
  externalQuery,
  onClearExternalQuery,
}) => {
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string>(
    lang === 'fr'
      ? "Prêt à démarrer l'échange vocal"
      : 'Ready for live voice conversation'
  );
  const [selectedVoice, setSelectedVoice] = useState<'Fenrir' | 'Charon'>('Fenrir');
  const [textInput, setTextInput] = useState('');
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'greeting',
      sender: 'assistant',
      text:
        lang === 'fr'
          ? "Bonjour, je suis l'assistant de Maélane, que souhaitez-vous savoir sur elle ?"
          : 'Hello, I am Maélane’s assistant, what would you like to know about her?',
      timestamp: 'Just now',
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const playerRef = useRef<LiveAudioPlayer | null>(null);
  const recorderRef = useRef<LiveMicRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeAnalyser, setActiveAnalyser] = useState<AnalyserNode | null>(null);

  // Initialize Audio Player
  useEffect(() => {
    const player = new LiveAudioPlayer((playing) => {
      setIsAssistantSpeaking(playing);
      if (playing) {
        setActiveAnalyser(player.getAnalyser());
      } else if (recorderRef.current && isMicActive) {
        setActiveAnalyser(recorderRef.current.getAnalyser());
      }
    });
    playerRef.current = player;

    return () => {
      player.close();
    };
  }, [isMicActive]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle external query triggered from Resume cards
  useEffect(() => {
    if (externalQuery) {
      handleSendText(externalQuery);
      onClearExternalQuery?.();
    }
  }, [externalQuery]);

  // Connect / Disconnect Live WebSocket
  const startLiveSession = useCallback(async () => {
    if (isLiveConnected) return;

    try {
      setIsConnecting(true);
      setStatusMessage(lang === 'fr' ? 'Connexion à Gemini 3.8 Live...' : 'Connecting to Gemini 3.8 Live...');

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live?voice=${selectedVoice}`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = async () => {
        setIsConnecting(false);
        setIsLiveConnected(true);
        setStatusMessage(
          lang === 'fr'
            ? 'Connecté à Gemini Live • Initialisation du micro...'
            : 'Connected to Gemini Live • Initializing mic...'
        );

        // Start microphone recorder
        try {
          const recorder = new LiveMicRecorder((base64Pcm) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'realtime_audio', audio: base64Pcm }));
            }
          });
          await recorder.start();
          recorderRef.current = recorder;
          setIsMicActive(true);
          setActiveAnalyser(recorder.getAnalyser());

          setStatusMessage(
            lang === 'fr'
              ? 'En écoute • Vous pouvez parler ou poser vos questions'
              : 'Listening • You can speak or ask questions'
          );

          // Trigger the required opening greeting:
          ws.send(JSON.stringify({ type: 'trigger_greeting', lang }));
        } catch (micErr: any) {
          console.error('Mic access error:', micErr);
          setStatusMessage(
            lang === 'fr'
              ? 'Micro désactivé ou refusé • Mode écoute active'
              : 'Microphone permission needed • Assistant listening'
          );
          // Trigger greeting anyway
          ws.send(JSON.stringify({ type: 'trigger_greeting', lang }));
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);

          if (data.type === 'audio' && data.audio) {
            playerRef.current?.enqueueChunk(data.audio);
          } else if (data.type === 'interrupted') {
            playerRef.current?.stop();
            setIsAssistantSpeaking(false);
          } else if (data.type === 'transcript') {
            const speaker = data.speaker === 'user' ? 'user' : 'assistant';
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last && last.sender === speaker) {
                return [
                  ...prev.slice(0, -1),
                  { ...last, text: (last.text + ' ' + data.text).trim() },
                ];
              }
              return [
                ...prev,
                {
                  id: String(Date.now()),
                  sender: speaker,
                  text: data.text,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ];
            });
          } else if (data.type === 'error') {
            console.error('Live error message:', data.error);
            setStatusMessage(`Error: ${data.error}`);
          }
        } catch (e) {
          console.error('Error parsing live WS message:', e);
        }
      };

      ws.onerror = (err) => {
        console.error('Live WS error:', err);
        setStatusMessage(lang === 'fr' ? 'Erreur de connexion Live' : 'Live connection error');
      };

      ws.onclose = () => {
        setIsLiveConnected(false);
        setIsConnecting(false);
        setIsMicActive(false);
        recorderRef.current?.stop();
        playerRef.current?.stop();
        setStatusMessage(lang === 'fr' ? 'Session vocale terminée' : 'Voice session ended');
      };
    } catch (err: any) {
      console.error('Failed to start Live session:', err);
      setIsConnecting(false);
      setStatusMessage(lang === 'fr' ? 'Impossible de démarrer la session' : 'Could not start live session');
    }
  }, [isLiveConnected, selectedVoice, lang]);

  const endLiveSession = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (recorderRef.current) {
      recorderRef.current.stop();
      recorderRef.current = null;
    }
    if (playerRef.current) {
      playerRef.current.stop();
    }
    setIsLiveConnected(false);
    setIsMicActive(false);
    setIsAssistantSpeaking(false);
    setActiveAnalyser(null);
    setStatusMessage(lang === 'fr' ? 'Session terminée' : 'Session ended');
  }, [lang]);

  const toggleMic = async () => {
    if (!recorderRef.current) return;
    if (isMicActive) {
      recorderRef.current.stop();
      setIsMicActive(false);
      setStatusMessage(lang === 'fr' ? 'Microphone en sourdine' : 'Microphone muted');
    } else {
      try {
        await recorderRef.current.start();
        setIsMicActive(true);
        setActiveAnalyser(recorderRef.current.getAnalyser());
        setStatusMessage(lang === 'fr' ? 'Microphone actif • En écoute' : 'Microphone active • Listening');
      } catch (e) {
        console.error('Failed to restart mic:', e);
      }
    }
  };

  // Play Speech Audio via REST TTS (unary WAV 24kHz)
  const speakTextWithTTS = async (text: string) => {
    try {
      setIsAssistantSpeaking(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice: selectedVoice }),
      });
      const data = await res.json();
      if (data.audio) {
        const audioBlob = new Blob(
          [Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))],
          { type: 'audio/wav' }
        );
        const url = URL.createObjectURL(audioBlob);
        const audio = new Audio(url);
        audio.onended = () => {
          setIsAssistantSpeaking(false);
        };
        audio.play();
      } else {
        setIsAssistantSpeaking(false);
      }
    } catch (e) {
      console.error('TTS error:', e);
      setIsAssistantSpeaking(false);
    }
  };

  // Trigger Opening Greeting
  const handleTriggerGreeting = () => {
    const greetingText =
      lang === 'fr'
        ? "Bonjour, je suis l'assistant de Maélane, que souhaitez-vous savoir sur elle ?"
        : 'Hello, I am Maélane’s assistant, what would you like to know about her?';

    setMessages((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        sender: 'assistant',
        text: greetingText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);

    if (isLiveConnected && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'trigger_greeting', lang }));
    } else {
      speakTextWithTTS(greetingText);
    }
  };

  // Handle sending text question
  const handleSendText = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;
    setTextInput('');

    // Append user message
    const userMsg: Message = {
      id: String(Date.now()),
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);

    // If live WebSocket is connected, forward to Live session
    if (isLiveConnected && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'send_text', text: query }));
      return;
    }

    // Otherwise use REST fallback
    setIsGeneratingText(true);
    setStatusMessage(lang === 'fr' ? 'Génération de la réponse...' : 'Generating response...');

    try {
      const history = messages.map((m) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      const data = await res.json();
      const reply = data.reply || '';

      const assistantMsg: Message = {
        id: String(Date.now() + 1),
        sender: 'assistant',
        text: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStatusMessage(lang === 'fr' ? 'Réponse reçue' : 'Response received');

      // Speak answer with deep tone
      speakTextWithTTS(reply);
    } catch (e: any) {
      console.error('Chat error:', e);
      setStatusMessage(lang === 'fr' ? 'Erreur lors de la réponse' : 'Failed to generate response');
    } finally {
      setIsGeneratingText(false);
    }
  };

  const samplePrompts =
    lang === 'fr'
      ? [
          'Parle-moi de son parcours en finance et gestion de patrimoine',
          "Pourquoi Maélane a-t-elle fondé ÉMERYS Conseil ?",
          "Qu'a-t-elle étudié lors de son échange à Monaco (IUM) ?",
          'Quelles sont ses compétences en analyse et sur Excel ?',
          'Comment puis-je contacter ou recruter Maélane ?',
        ]
      : [
          "Tell me about Maélane's finance and wealth management background",
          'What is her venture ÉMERYS Conseil about?',
          'What did she study during her exchange at IUM Monaco?',
          'What are her key skills in Excel, strategy and languages?',
          'How can I get in touch or recruit Maélane?',
        ];

  return (
    <div className="flex flex-col h-full bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-md">
      {/* Top Bar / Controls */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isLiveConnected
                  ? 'bg-emerald-400 ring-4 ring-emerald-400/20 animate-pulse'
                  : 'bg-slate-600'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-semibold text-sm">
                {lang === 'fr' ? "Assistant Vocal de Maélane" : "Maélane's Voice Assistant"}
              </span>
              <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">
                Gemini 3.8 Live
              </span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <span>
                {lang === 'fr'
                  ? 'Voix grave masculine (accent US en EN, accent FR en français)'
                  : 'Deep male tone (American accent EN, French accent FR)'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switch */}
          <button
            onClick={() => {
              const newLang = lang === 'fr' ? 'en' : 'fr';
              setLang(newLang);
              setStatusMessage(
                newLang === 'fr'
                  ? 'Langue définie : Français'
                  : 'Language set: English'
              );
            }}
            className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-semibold uppercase">{lang}</span>
          </button>

          {/* Voice selector */}
          <div className="flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
            <span className="text-slate-400 text-[10px]">Voice:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              disabled={isLiveConnected}
              className="bg-transparent text-amber-300 text-xs focus:outline-none cursor-pointer"
            >
              <option value="Fenrir" className="bg-slate-900 text-white">
                Fenrir (Deep Baritone)
              </option>
              <option value="Charon" className="bg-slate-900 text-white">
                Charon (Deep Bass)
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Visualizer & Live Call Controls */}
      <div className="py-6 px-4 bg-gradient-to-b from-slate-950/40 to-slate-900/60 border-b border-slate-800 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Visualizer Canvas */}
        <div className="relative my-2">
          <AudioWaveformVisualizer
            analyser={activeAnalyser}
            isActive={isLiveConnected || isAssistantSpeaking}
            isSpeaking={isAssistantSpeaking}
            mode="circular"
          />

          {/* Central status pill */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="p-3 rounded-full bg-slate-950/80 border border-slate-700/80 shadow-2xl backdrop-blur-md">
              {isAssistantSpeaking ? (
                <Volume2 className="w-8 h-8 text-indigo-400 animate-pulse" />
              ) : isMicActive ? (
                <Mic className="w-8 h-8 text-emerald-400 animate-bounce" />
              ) : (
                <Radio className="w-8 h-8 text-slate-400" />
              )}
            </div>
          </div>
        </div>

        {/* Live Status readout */}
        <div className="mt-2 text-center max-w-md">
          <p className="text-xs font-medium text-slate-300 transition-all">{statusMessage}</p>
        </div>

        {/* Control Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {!isLiveConnected ? (
            <button
              onClick={startLiveSession}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-950/40 transition-all transform active:scale-95 disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4" />
              <span>
                {isConnecting
                  ? lang === 'fr'
                    ? 'Connexion en cours...'
                    : 'Connecting...'
                  : lang === 'fr'
                  ? 'Démarrer la conversation vocale'
                  : 'Start Live Voice Call'}
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isMicActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                }`}
              >
                {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                <span>
                  {isMicActive
                    ? lang === 'fr'
                      ? 'Couper le micro'
                      : 'Mute Mic'
                    : lang === 'fr'
                    ? 'Activer le micro'
                    : 'Unmute Mic'}
                </span>
              </button>

              <button
                onClick={endLiveSession}
                className="flex items-center gap-2 bg-rose-600/90 hover:bg-rose-500 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Raccrocher' : 'End Call'}</span>
              </button>
            </>
          )}

          {/* Quick Greeting Trigger */}
          <button
            onClick={handleTriggerGreeting}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
            title="Say official opening greeting"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'fr' ? "Rejouer l'accueil" : 'Play Greeting'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <HelpCircle className="w-3 h-3 text-amber-400" />
            <span>{lang === 'fr' ? 'Sujets suggérés :' : 'Suggested topics:'}</span>
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(prompt)}
              className="text-[11px] text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 px-2.5 py-1 rounded-full border border-slate-700/60 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Conversation Transcript */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[380px]">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] text-slate-400 font-medium">
                {msg.sender === 'user'
                  ? lang === 'fr'
                    ? 'Vous'
                    : 'You'
                  : lang === 'fr'
                  ? "Assistant de Maélane (Voix grave)"
                  : "Maélane's Assistant (Deep Voice)"}
              </span>
              <span className="text-[9px] text-slate-500">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-md ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.sender === 'assistant' && (
                <button
                  onClick={() => speakTextWithTTS(msg.text)}
                  className="mt-2 text-[10px] text-amber-300 hover:text-amber-200 flex items-center gap-1 bg-slate-900/60 px-2 py-0.5 rounded transition-colors"
                  title="Replay in spoken voice"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>{lang === 'fr' ? 'Écouter' : 'Listen'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isGeneratingText && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>{lang === 'fr' ? "L'assistant formule sa réponse..." : 'Assistant is formulating response...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Text Input Bar */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendText(textInput);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={
              lang === 'fr'
                ? 'Tapez une question sur Maélane ou utilisez la voix...'
                : 'Type a question about Maélane or use voice...'
            }
            className="flex-1 bg-slate-800/80 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isGeneratingText}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all active:scale-95"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
