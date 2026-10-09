import React, { useState } from 'react';
import {
  Mic,
  FileText,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe2,
  ShieldCheck,
  CheckCircle2,
  Compass,
} from 'lucide-react';
import { VoiceAssistantHub } from './components/VoiceAssistantHub.tsx';
import { ResumeExplorer } from './components/ResumeExplorer.tsx';
import { EmerysLogo } from './components/EmerysLogo.tsx';
import { MAELANE_DATA } from './data/resumeData.ts';

export default function App() {
  const [lang, setLang] = useState<'fr' | 'en'>('fr');
  const [activeTab, setActiveTab] = useState<'split' | 'assistant' | 'resume'>('split');
  const [externalQuery, setExternalQuery] = useState<string | undefined>(undefined);

  const handleAskAbout = (query: string) => {
    setExternalQuery(query);
    if (window.innerWidth < 1024) {
      setActiveTab('assistant');
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#E7E2DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-17 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <EmerysLogo variant="horizontal" size="md" showTagline={false} />
            <div className="pl-3 border-l border-[#E7E2DA]">
              <div className="flex items-center gap-2">
                <span className="font-bold text-stone-900 text-sm tracking-tight">{MAELANE_DATA.name}</span>
                <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                  Fondatrice d’Émerys Conseil
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                ESCE Programme Grande École
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Switcher */}
            <div className="flex bg-white border border-[#E7E2DA] p-1 rounded-xl text-xs shadow-2xs">
              <button
                onClick={() => setActiveTab('split')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'split'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-800'
                }`}
              >
                <span>{lang === 'fr' ? 'Vue Complète' : 'Dual View'}</span>
              </button>
              <button
                onClick={() => setActiveTab('assistant')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'assistant'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-800'
                }`}
              >
                <Mic className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Voix & Échange' : 'Voice Agent'}</span>
              </button>
              <button
                onClick={() => setActiveTab('resume')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  activeTab === 'resume'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-emerald-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Profil & Parcours' : 'Profile'}</span>
              </button>
            </div>

            {/* Language toggle button */}
            <button
              onClick={() => setLang(lang === 'fr' ? 'en' : 'fr')}
              className="flex items-center gap-1.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold px-3 py-2 rounded-xl border border-[#E7E2DA] transition-all shadow-2xs"
              title="Toggle English / Français"
            >
              <Globe2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'fr' ? 'FR 🇫🇷' : 'EN 🇺🇸'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Welcome Banner - Clean beige with subtle emerald accents */}
      <section className="bg-white/80 border-b border-[#E7E2DA] py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200">
              <Sparkles className="w-4 h-4" />
            </span>
            <p className="text-xs text-stone-600">
              <strong className="text-emerald-900 font-semibold">
                {lang === 'fr' ? "Assistant Vocal Représentant Maélane :" : "Voice Assistant Representing Maélane:"}
              </strong>{' '}
              {lang === 'fr'
                ? "Voix grave masculine, bilingue Français & Anglais. Discutez en direct de son activité Émerys Conseil, de son parcours et de ses compétences."
                : "Deep male voice, bilingual English & French. Speak live about Émerys Conseil, her background and core competencies."}
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-500">
            <span className="flex items-center gap-1 font-medium text-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>{lang === 'fr' ? 'Profil certifié ESCE & Émerys' : 'Verified Profile ESCE & Émerys'}</span>
            </span>
            <span>•</span>
            <span className="italic text-stone-600 font-medium">
              “Hello, I am Maélane’s assistant, what would you like to know about her?”
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

      {/* Footer - Minimal and refined */}
      <footer className="bg-white border-t border-[#E7E2DA] py-5 px-4 sm:px-6 lg:px-8 text-xs text-stone-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <EmerysLogo variant="horizontal" size="sm" showTagline={false} />
            <div className="text-left pl-3 border-l border-[#E7E2DA]">
              <span className="font-bold text-stone-900 block">{MAELANE_DATA.name}</span>
              <span className="text-[11px] text-emerald-800 font-semibold">Fondatrice d'Émerys Conseil</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-stone-600 font-medium">
            <a
              href={`mailto:${MAELANE_DATA.proEmail}`}
              className="text-emerald-900 font-bold hover:text-emerald-700 transition-colors flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200"
              title="Email Professionnel & Patrimoine"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.proEmail}</span>
            </a>
            <a
              href={`mailto:${MAELANE_DATA.email}`}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.email}</span>
            </a>
            <a
              href={`mailto:${MAELANE_DATA.userEmail}`}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.userEmail}</span>
            </a>
            <a
              href={`tel:${MAELANE_DATA.phone.replace(/\./g, '')}`}
              className="hover:text-emerald-700 transition-colors flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.phone}</span>
            </a>
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Paris 17, Lyon 6</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
