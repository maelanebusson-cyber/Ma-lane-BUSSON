import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Volume2,
  Sparkles,
  Send,
  Languages,
  Radio,
  HelpCircle,
} from 'lucide-react';
import { AudioWaveformVisualizer } from './AudioWaveformVisualizer.tsx';
import { LiveAudioPlayer } from '../utils/audioStreamer.ts';
import { LiveMicRecorder } from '../utils/micRecorder.ts';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
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
      ? "Prêt à démarrer l'échange vocal en temps réel"
      : 'Ready for real-time voice conversation'
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
              ? 'En écoute • Posez vos questions à la voix'
              : 'Listening • Ask your questions by voice'
          );

          // Trigger the required opening greeting
          ws.send(JSON.stringify({ type: 'trigger_greeting', lang }));
        } catch (micErr: any) {
          console.error('Mic access error:', micErr);
          setStatusMessage(
            lang === 'fr'
              ? 'Micro désactivé • Mode écoute active'
              : 'Microphone permission needed • Assistant listening'
          );
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
          "Pourquoi Maélane a-t-elle fondé Émerys Conseil ?",
          "Parle-moi de ses voyages dans le monde et son échange à New York (janvier 2026, 6 mois)",
          "Quelle est son expérience de 2 ans en gestion de patrimoine et ses outils (Inovéa, Filianse) ?",
          "Qu'est-ce qui la différencie sur le marché du travail (son triple profil) ?",
          "Parle-moi de son aisance avec l'IA et de sa passion pour la photo",
        ]
      : [
          "Why did Maélane found Émerys Conseil?",
          "Tell me about her world travels and 6-month NYC exchange at Baruch College (Jan 2026)",
          "Tell me about her 2 years in wealth management and tools like Inovéa & Filianse",
          "What sets her apart on the job market (her triple dimension)?",
          "Tell me about her AI mastery and passion for photography",
        ];

  return (
    <div className="flex flex-col h-full bg-white border border-[#E7E2DA] rounded-2xl shadow-sm overflow-hidden">
      {/* Top Bar / Controls */}
      <div className="p-4 bg-[#FAF8F5] border-b border-[#EFECE6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div
              className={`w-3.5 h-3.5 rounded-full ${
                isLiveConnected
                  ? 'bg-emerald-600 ring-4 ring-emerald-600/20 animate-pulse'
                  : 'bg-stone-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-stone-900 font-bold text-sm">
                {lang === 'fr' ? "Assistant Vocal de Maélane" : "Maélane's Voice Assistant"}
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-semibold">
                Gemini 3.8 Live
              </span>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
              <span>
                {lang === 'fr'
                  ? 'Voix grave masculine (accent US en anglais, accent FR en français)'
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
            className="flex items-center gap-1.5 text-xs bg-white hover:bg-stone-50 text-stone-700 px-2.5 py-1.5 rounded-lg border border-[#E7E2DA] transition-colors font-medium shadow-2xs"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-bold uppercase text-emerald-900">{lang}</span>
          </button>

          {/* Voice selector */}
          <div className="flex items-center gap-1 text-xs bg-white px-2.5 py-1 rounded-lg border border-[#E7E2DA] shadow-2xs">
            <span className="text-stone-500 text-[10px]">Voix:</span>
            <select
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value as any)}
              disabled={isLiveConnected}
              className="bg-transparent text-emerald-900 font-semibold text-xs focus:outline-none cursor-pointer"
            >
              <option value="Fenrir">Fenrir (Baritone grave)</option>
              <option value="Charon">Charon (Basse profonde)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Interactive Stage: Visualizer & Live Call Controls */}
      <div className="py-7 px-4 bg-gradient-to-b from-[#FDFCF9] to-[#FAF8F5] border-b border-[#EFECE6] flex flex-col items-center justify-center relative overflow-hidden">
        {/* Visualizer Canvas */}
        <div className="relative my-1">
          <AudioWaveformVisualizer
            analyser={activeAnalyser}
            isActive={isLiveConnected || isAssistantSpeaking}
            isSpeaking={isAssistantSpeaking}
            mode="circular"
          />

          {/* Central status icon */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="p-3.5 rounded-full bg-white border border-[#E7E2DA] shadow-md">
              {isAssistantSpeaking ? (
                <Volume2 className="w-8 h-8 text-emerald-700 animate-pulse" />
              ) : isMicActive ? (
                <Mic className="w-8 h-8 text-emerald-700 animate-bounce" />
              ) : (
                <Radio className="w-8 h-8 text-stone-400" />
              )}
            </div>
          </div>
        </div>

        {/* Live Status readout */}
        <div className="mt-3 text-center max-w-md">
          <p className="text-xs font-semibold text-stone-700 transition-all">{statusMessage}</p>
        </div>

        {/* Control Buttons */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {!isLiveConnected ? (
            <button
              onClick={startLiveSession}
              disabled={isConnecting}
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-sm transition-all transform active:scale-95 disabled:opacity-50"
            >
              <PhoneCall className="w-4 h-4" />
              <span>
                {isConnecting
                  ? lang === 'fr'
                    ? 'Connexion en cours...'
                    : 'Connecting...'
                  : lang === 'fr'
                  ? 'Démarrer la conversation vocale en direct'
                  : 'Start Live Voice Call'}
              </span>
            </button>
          ) : (
            <>
              <button
                onClick={toggleMic}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isMicActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                    : 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
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
                className="flex items-center gap-2 bg-rose-700 hover:bg-rose-800 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
              >
                <PhoneOff className="w-4 h-4" />
                <span>{lang === 'fr' ? 'Raccrocher' : 'End Call'}</span>
              </button>
            </>
          )}

          {/* Quick Greeting Trigger */}
          <button
            onClick={handleTriggerGreeting}
            className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-emerald-800 text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-[#E7E2DA] transition-all shadow-2xs"
            title="Say official opening greeting"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'fr' ? "Rejouer l'accueil officiel" : 'Play Greeting'}</span>
          </button>
        </div>
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-3 bg-[#FAF8F5] border-b border-[#EFECE6] overflow-x-auto scrollbar-none">
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-[11px] text-emerald-900 font-bold flex items-center gap-1">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-700" />
            <span>{lang === 'fr' ? 'Sujets recommandés :' : 'Recommended topics:'}</span>
          </span>
          {samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendText(prompt)}
              className="text-[11px] font-medium text-stone-700 hover:text-emerald-950 bg-white hover:bg-emerald-50 px-3 py-1.5 rounded-full border border-[#E7E2DA] hover:border-emerald-300 transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Conversation Transcript */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 max-h-[380px] bg-white">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div className="flex items-center gap-1.5 mb-1 px-1">
              <span className="text-[10px] text-stone-500 font-semibold">
                {msg.sender === 'user'
                  ? lang === 'fr'
                    ? 'Vous'
                    : 'You'
                  : lang === 'fr'
                  ? "Assistant de Maélane (Voix grave)"
                  : "Maélane's Assistant (Deep Voice)"}
              </span>
              <span className="text-[9px] text-stone-400">{msg.timestamp}</span>
            </div>

            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed shadow-2xs ${
                msg.sender === 'user'
                  ? 'bg-emerald-700 text-white rounded-tr-none'
                  : 'bg-[#FAF8F5] text-stone-800 border border-[#E7E2DA] rounded-tl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>

              {msg.sender === 'assistant' && (
                <button
                  onClick={() => speakTextWithTTS(msg.text)}
                  className="mt-2 text-[11px] text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-emerald-200 transition-colors"
                  title="Replay in spoken voice"
                >
                  <Volume2 className="w-3 h-3 text-emerald-700" />
                  <span>{lang === 'fr' ? 'Écouter' : 'Listen'}</span>
                </button>
              )}
            </div>
          </div>
        ))}
        {isGeneratingText && (
          <div className="flex items-center gap-2 text-xs text-stone-500 italic py-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700 animate-spin" />
            <span>{lang === 'fr' ? "L'assistant formule sa réponse..." : 'Assistant is formulating response...'}</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Text Input Bar */}
      <div className="p-3 bg-[#FAF8F5] border-t border-[#EFECE6]">
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
                ? 'Posez une question sur Émerys Conseil, ses compétences ou son parcours...'
                : 'Ask a question about Émerys Conseil, skills, or background...'
            }
            className="flex-1 bg-white border border-[#E7E2DA] rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 shadow-2xs"
          />
          <button
            type="submit"
            disabled={!textInput.trim() || isGeneratingText}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white p-2.5 rounded-xl transition-all active:scale-95 shadow-sm"
            title="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
