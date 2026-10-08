import React, { useState } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  Car,
  Languages,
  BookOpen,
} from 'lucide-react';
import { MAELANE_DATA } from '../data/resumeData.ts';
import maelanePhoto from '../assets/images/maelane.jpg';

interface ResumeExplorerProps {
  onAskAbout: (query: string) => void;
  lang: 'en' | 'fr';
}

export const ResumeExplorer: React.FC<ResumeExplorerProps> = ({ onAskAbout, lang }) => {
  const [activeTab, setActiveTab] = useState<'experiences' | 'education' | 'skills' | 'associative'>('experiences');

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl backdrop-blur-md">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-slate-800">
        <div className="relative group">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-lg shadow-amber-500/10">
            <img
              src={maelanePhoto}
              alt={MAELANE_DATA.name}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded-full shadow">
            ESCE / IUM
          </span>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white tracking-tight">{MAELANE_DATA.name}</h1>
            <span className="bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 text-xs px-2.5 py-0.5 rounded-full font-medium">
              {lang === 'fr' ? 'Entrepreneuse & Étudiante Bac+5' : 'Entrepreneur & Master Student'}
            </span>
          </div>

          <p className="text-amber-300/90 text-sm font-medium mb-3">
            {MAELANE_DATA.school} • ÉMERYS Conseil
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-y-2 gap-x-4 text-xs text-slate-300">
            <a
              href={`mailto:${MAELANE_DATA.email}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors bg-slate-800/80 px-2.5 py-1 rounded-md"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{MAELANE_DATA.email}</span>
            </a>
            <a
              href={`tel:${MAELANE_DATA.phone.replace(/\./g, '')}`}
              className="flex items-center gap-1.5 hover:text-amber-300 transition-colors bg-slate-800/80 px-2.5 py-1 rounded-md"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{MAELANE_DATA.phone}</span>
            </a>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Lyon (69006), France</span>
            </div>
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-md">
              <Car className="w-3.5 h-3.5 text-amber-400" />
              <span>{MAELANE_DATA.license}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 mt-6 gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeTab === 'experiences'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Expériences Professionnelles' : 'Work Experience'}</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeTab === 'education'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Formations & Cursus' : 'Education'}</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeTab === 'skills'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Compétences & Langues' : 'Skills & Languages'}</span>
        </button>

        <button
          onClick={() => setActiveTab('associative')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-all shrink-0 ${
            activeTab === 'associative'
              ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Vie Associative' : 'Extracurriculars'}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-5 space-y-4">
        {activeTab === 'experiences' && (
          <div className="space-y-4">
            {MAELANE_DATA.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 transition-all hover:border-slate-600 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-amber-300 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-amber-400/90 text-xs font-medium">
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs bg-slate-900/80 px-2 py-0.5 rounded">
                      {exp.period}
                    </span>
                    <button
                      onClick={() =>
                        onAskAbout(
                          lang === 'fr'
                            ? `Peux-tu m'en dire plus sur l'expérience de Maélane chez ${exp.company} en tant que ${exp.role} ?`
                            : `Can you tell me more about Maélane's experience at ${exp.company} as ${exp.role}?`
                        )
                      }
                      title={lang === 'fr' ? "Demander à l'assistant" : 'Ask assistant'}
                      className="p-1.5 text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/60 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px] font-medium">
                        {lang === 'fr' ? 'Parler de ce poste' : 'Ask'}
                      </span>
                    </button>
                  </div>
                </div>

                <ul className="space-y-1.5 mt-2">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-amber-400 mt-1">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'education' && (
          <div className="space-y-4">
            {MAELANE_DATA.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 transition-all hover:border-slate-600 group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-white font-semibold text-sm group-hover:text-amber-300 transition-colors">
                      {edu.institution}
                    </h3>
                    <div className="text-amber-400/90 text-xs font-medium">{edu.degree}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-xs bg-slate-900/80 px-2 py-0.5 rounded">
                      {edu.period}
                    </span>
                    <button
                      onClick={() =>
                        onAskAbout(
                          lang === 'fr'
                            ? `Qu'a appris Maélane durant sa formation à ${edu.institution} ?`
                            : `What did Maélane learn during her studies at ${edu.institution}?`
                        )
                      }
                      className="p-1.5 text-indigo-400 hover:text-indigo-200 hover:bg-indigo-950/60 rounded-lg transition-colors flex items-center gap-1 text-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px] font-medium">
                        {lang === 'fr' ? 'Détails' : 'Ask'}
                      </span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mb-2">{edu.description}</p>

                {edu.highlights && edu.highlights.length > 0 && (
                  <div className="space-y-1.5 pl-2 border-l-2 border-amber-500/40 mt-2">
                    {edu.highlights.map((h, hIdx) => (
                      <p key={hIdx} className="text-xs text-slate-300 leading-relaxed">
                        {h}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="space-y-5">
            <div>
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Langues Maîtrisées' : 'Languages'}</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {MAELANE_DATA.languages.map((l, idx) => (
                  <div
                    key={idx}
                    className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <div>
                      <div className="text-white text-xs font-semibold">{l.language}</div>
                      <div className="text-slate-400 text-[11px]">{l.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                <span>{lang === 'fr' ? 'Compétences & Outils' : 'Skills & Tools'}</span>
              </h4>
              <div className="space-y-3">
                {MAELANE_DATA.skills.map((sc, sIdx) => (
                  <div key={sIdx} className="bg-slate-800/40 rounded-xl p-3 border border-slate-700/40">
                    <div className="text-xs font-medium text-slate-200 mb-2">{sc.category}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {sc.items.map((item, itemIdx) => (
                        <span
                          key={itemIdx}
                          className="bg-slate-900/80 text-amber-300 border border-slate-700 text-xs px-2.5 py-1 rounded-lg"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'associative' && (
          <div className="space-y-3">
            {MAELANE_DATA.associative.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/50 border border-slate-700/60 rounded-xl p-4 transition-all hover:border-slate-600"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  <span className="text-slate-400 text-xs bg-slate-900/80 px-2 py-0.5 rounded">
                    {item.period}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
