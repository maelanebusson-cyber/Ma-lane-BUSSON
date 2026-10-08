import React, { useState } from 'react';
import {
  Mic,
  FileText,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { VoiceAssistantHub } from './components/VoiceAssistantHub.tsx';
import { ResumeExplorer } from './components/ResumeExplorer.tsx';
import { MAELANE_DATA } from './data/resumeData.ts';

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('en');
  const [activeTab, setActiveTab] = useState<'split' | 'assistant' | 'resume'>('split');
  const [externalQuery, setExternalQuery] = useState<string | undefined>(undefined);

  const handleAskAbout = (query: string) => {
    setExternalQuery(query);
    // On small screens, switch to assistant tab so user sees response
    if (window.innerWidth < 1024) {
      setActiveTab('assistant');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 p-0.5 shadow-md shadow-indigo-900/30">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-amber-400 text-sm tracking-widest">
                MB
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">{MAELANE_DATA.name}</span>
                <span className="hidden sm:inline-block bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] px-2 py-0.5 rounded-full font-medium">
                  Live AI Voice Agent
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-xs sm:max-w-none">
                {lang === 'fr'
                  ? 'Étudiante ESCE Lyon/Paris • Fondatrice ÉMERYS Conseil'
                  : 'ESCE Lyon/Paris Student • Founder ÉMERYS Conseil'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher for responsive/preference */}
            <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl text-xs">
              <button
                onClick={() => setActiveTab('split')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'split'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>{lang === 'fr' ? 'Vue Complète' : 'Dual View'}</span>
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'assistant'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Assistant Vocal' : 'Voice Agent'}</span>
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                  activeTab === 'resume'
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'CV & Profil' : 'Resume'}</span>
              </button>
            </div>

            {/* Language toggle button */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-800 transition-all"
              title="Toggle English / Français"
            >
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'fr' ? 'FR 🇫🇷' : 'EN 🇺🇸'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border-b border-slate-800/80 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <p className="text-xs text-slate-300">
              <strong className="text-white">
                {lang === 'fr' ? "Assistant Vocal Interactif :" : "Interactive Voice Assistant:"}
              </strong>{' '}
              {lang === 'fr'
                ? "Discutez en temps réel avec l'assistant de Maélane (ton grave masculin, bilingue FR/EN) propulsé par Gemini 3.8 Live."
                : "Talk in real time with Maélane's voice assistant (deep male tone, bilingual EN/FR) powered by Gemini 3.8 Live."}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'fr' ? 'Données CV certifiées' : 'Verified CV Data'}</span>
            </span>
            <span>•</span>
            <span className="text-amber-400 font-medium">
              {lang === 'fr' ? '“Hello, I am maélane’s assistant...”' : '“Hello, I am maélane’s assistant...”'}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          {/* Voice Assistant Column */}
          <div
            className={`transition-all duration-300 ${
              activeTab === 'split'
                ? 'lg:col-span-6 xl:col-span-6'
                : activeTab === 'assistant'
                ? 'lg:col-span-12'
                : 'hidden'
            }`}
          >
            <VoiceAssistantHub
              lang={lang}
              setLang={setLang}
              externalQuery={externalQuery}
              onClearExternalQuery={() => setExternalQuery(undefined)}
            />
          </div>

          {/* Resume Explorer Column */}
          <div
            className={`transition-all duration-300 ${
              activeTab === 'split'
                ? 'lg:col-span-6 xl:col-span-6'
                : activeTab === 'resume'
                ? 'lg:col-span-12'
                : 'hidden'
            }`}
          >
            <ResumeExplorer onAskAbout={handleAskAbout} lang={lang} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">Maélane BUSSON</span>
            <span>•</span>
            <span>ESCE International Business School (Lyon/Paris) & IUM Monaco</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300">
            <a
              href={`mailto:${MAELANE_DATA.email}`}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{MAELANE_DATA.email}</span>
            </a>
            <a
              href={`mailto:${MAELANE_DATA.userEmail}`}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{MAELANE_DATA.userEmail}</span>
            </a>
            <a
              href={`tel:${MAELANE_DATA.phone.replace(/\./g, '')}`}
              className="hover:text-amber-400 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{MAELANE_DATA.phone}</span>
            </a>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Lyon, France</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
