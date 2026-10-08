import express from 'express';
import http from 'http';
import path from 'path';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, Modality, LiveServerMessage } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { MAELANE_DATA, MAELANE_SYSTEM_PROMPT } from './src/data/resumeData.ts';

dotenv.config();

const PORT = 3000;
const isProd = process.env.NODE_ENV === 'production';

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '10mb' }));

  const server = http.createServer(app);

  const apiKey = process.env.GEMINI_API_KEY || '';
  const ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // REST API Routes
  app.get('/api/info', (_req, res) => {
    res.json(MAELANE_DATA);
  });

  // REST Chat endpoint using gemini-3.8-flash
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history = [] } = req.body;
      if (!message) {
        return res.status(400).json({ error: 'Message is required' });
      }

      const formattedContents = [
        ...history.map((h: { role: string; content: string }) => ({
          role: h.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: h.content }],
        })),
        {
          role: 'user',
          parts: [{ text: message }],
        },
      ];

      let response;
      try {
        response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: formattedContents,
          config: {
            systemInstruction: MAELANE_SYSTEM_PROMPT,
            temperature: 0.7,
          },
        });
      } catch (err: any) {
        console.warn('Initial model call failed, retrying with gemini-flash-latest:', err?.message);
        response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: formattedContents,
          config: {
            systemInstruction: MAELANE_SYSTEM_PROMPT,
            temperature: 0.7,
          },
        });
      }

      const reply = response.text || "Hello, I am Maélane's assistant, what would you like to know about her?";
      res.json({ reply });
    } catch (error: any) {
      console.error('Chat error:', error);
      res.status(500).json({ error: error.message || 'Chat generation failed' });
    }
  });

  // REST Text-to-Speech endpoint using gemini-3.8-flash-lite-tts
  app.post('/api/tts', async (req, res) => {
    try {
      const { text, voice = 'Fenrir' } = req.body;
      if (!text) {
        return res.status(400).json({ error: 'Text is required' });
      }

      // Ensure school acronym ESCE is spelled letter-by-letter (E-S-C-E)
      const spokenText = text
        .replace(/\bESCE\b/g, 'E - S - C - E')
        .replace(/\bPROM'ESCE\b/gi, "PROM' E - S - C - E");

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: spokenText,
                speechMetadata: {
                  style: 'Deep, calm, confident male tone with distinguished American or French cadence',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!base64Audio) {
        return res.status(500).json({ error: 'No audio returned from model' });
      }

      res.json({ audio: base64Audio, mimeType: 'audio/wav' });
    } catch (error: any) {
      console.error('TTS error:', error);
      res.status(500).json({ error: error.message || 'TTS generation failed' });
    }
  });

  // WebSocket Server for Gemini 3.8 Live API real-time audio conversation
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/api/live') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  wss.on('connection', async (clientWs: WebSocket, request) => {
    console.log('Client connected to Live audio bridge');
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    const selectedVoice = url.searchParams.get('voice') || 'Fenrir';

    let session: any = null;
    let isSessionReady = false;
    const messageQueue: any[] = [];

    const processMessage = (parsed: any) => {
      if (!session) return;
      try {
        if (parsed.type === 'realtime_audio' && parsed.audio) {
          session.sendRealtimeInput({
            audio: {
              data: parsed.audio,
              mimeType: 'audio/pcm;rate=16000',
            },
          });
        } else if (parsed.type === 'send_text' && parsed.text) {
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [{ text: parsed.text }],
              },
            ],
            turnComplete: true,
          });
        } else if (parsed.type === 'trigger_greeting') {
          const isFr = parsed.lang === 'fr';
          session.sendClientContent({
            turns: [
              {
                role: 'user',
                parts: [
                  {
                    text: isFr
                      ? "Présente-toi immédiatement avec ta phrase d'accueil officielle : 'Bonjour, je suis l'assistant de Maélane, que souhaitez-vous savoir sur elle ?'"
                      : "Introduce yourself immediately with your official opening greeting: 'Hello, I am Maélane’s assistant, what would you like to know about her?'",
                  },
                ],
              },
            ],
            turnComplete: true,
          });
        }
      } catch (e) {
        console.error('Error in processMessage:', e);
      }
    };

    clientWs.on('message', (rawData) => {
      try {
        const parsed = JSON.parse(rawData.toString());
        if (!isSessionReady || !session) {
          messageQueue.push(parsed);
        } else {
          processMessage(parsed);
        }
      } catch (e) {
        console.error('Error handling WebSocket message:', e);
      }
    });

    try {
      session = await ai.live.connect({
        model: 'gemini-3.8-live',
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: selectedVoice },
            },
          },
          systemInstruction: MAELANE_SYSTEM_PROMPT,
        },
        callbacks: {
          onopen: () => {
            console.log('Gemini Live session connected');
            isSessionReady = true;
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'ready' }));
            }
            // Flush any queued messages
            while (messageQueue.length > 0) {
              const msg = messageQueue.shift();
              processMessage(msg);
            }
          },
          onmessage: (message: LiveServerMessage) => {
            if (clientWs.readyState !== WebSocket.OPEN) return;

            // Audio parts from modelTurn
            const parts = message.serverContent?.modelTurn?.parts;
            if (parts) {
              for (const part of parts) {
                if (part.inlineData?.data) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'audio',
                      audio: part.inlineData.data,
                    })
                  );
                }
                if (part.text) {
                  clientWs.send(
                    JSON.stringify({
                      type: 'text_chunk',
                      text: part.text,
                    })
                  );
                }
              }
            }

            // Transcripts
            if (message.serverContent?.outputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  type: 'transcript',
                  speaker: 'model',
                  text: message.serverContent.outputTranscription.text,
                })
              );
            }

            if (message.serverContent?.inputTranscription?.text) {
              clientWs.send(
                JSON.stringify({
                  type: 'transcript',
                  speaker: 'user',
                  text: message.serverContent.inputTranscription.text,
                })
              );
            }

            // Interruption handling
            if (message.serverContent?.interrupted) {
              clientWs.send(JSON.stringify({ type: 'interrupted' }));
            }

            // Turn complete
            if (message.serverContent?.turnComplete) {
              clientWs.send(JSON.stringify({ type: 'turn_complete' }));
            }
          },
          onerror: (err: any) => {
            console.error('Gemini Live session error:', err);
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(
                JSON.stringify({
                  type: 'error',
                  error: err?.message || 'Gemini Live error',
                })
              );
            }
          },
          onclose: () => {
            console.log('Gemini Live session closed');
            if (clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ type: 'closed' }));
            }
          },
        },
      });

      // Flush queue in case onopen already fired
      isSessionReady = true;
      while (messageQueue.length > 0) {
        const msg = messageQueue.shift();
        processMessage(msg);
      }

      clientWs.on('close', () => {
        try {
          if (session) {
            session.close();
          }
        } catch (err) {
          console.error('Error closing Gemini Live session:', err);
        }
      });
    } catch (sessionErr: any) {
      console.error('Failed to establish Gemini Live session:', sessionErr);
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: 'error',
            error: sessionErr?.message || 'Could not connect to Gemini Live',
          })
        );
      }
    }
  });

  // Vite middleware in dev or express.static in production
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  });
}

startServer().catch((err) => {
  console.error('Server startup error:', err);
});
