import React, { useState, useRef } from 'react';
import {
  Briefcase,
  GraduationCap,
  Award,
  Users,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  Car,
  Camera,
  Bot,
  Globe,
  Upload,
  CheckCircle2,
  TrendingUp,
  Plane,
  Compass,
} from 'lucide-react';
import { MAELANE_DATA } from '../data/resumeData.ts';
import defaultMaelanePhoto from '../assets/images/maelane.jpg';
import { EmerysLogo } from './EmerysLogo.tsx';

interface ResumeExplorerProps {
  onAskAbout: (query: string) => void;
  lang: 'en' | 'fr';
}

export const ResumeExplorer: React.FC<ResumeExplorerProps> = ({ onAskAbout, lang }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'experiences' | 'education' | 'skills' | 'travels' | 'associative'>('overview');
  const [photoSrc, setPhotoSrc] = useState<string>(() => {
    return localStorage.getItem('maelane_custom_photo_v2') || defaultMaelanePhoto;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      setPhotoSrc(base64Data);
      localStorage.setItem('maelane_custom_photo_v2', base64Data);

      // Persist to server
      try {
        await fetch('/api/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64Data }),
        });
      } catch (err) {
        console.error('Failed to sync photo to server:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="bg-white border border-[#E7E2DA] rounded-2xl p-6 md:p-7 shadow-sm transition-all">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 pb-6 border-b border-[#EFECE6]">
        <div className="relative group shrink-0">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-emerald-600/30 shadow-md relative bg-[#FAF8F5]">
            <img
              src={photoSrc}
              alt={MAELANE_DATA.name}
              className="w-full h-full object-cover object-[center_20%] transition-transform duration-500 group-hover:scale-105"
            />
            {/* Upload overlay button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-medium p-1 cursor-pointer"
              title={lang === 'fr' ? 'Importer votre photo originale exacte' : 'Upload exact original photo'}
            >
              <Upload className="w-5 h-5 mb-1" />
              <span>{lang === 'fr' ? 'Photo originale' : 'Original photo'}</span>
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-emerald-700 hover:bg-emerald-800 text-white font-medium text-[10px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 cursor-pointer"
            title="Importer ma photo originale"
          >
            <Camera className="w-3 h-3" />
            <span>Photo</span>
          </button>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">{MAELANE_DATA.name}</h1>
            <EmerysLogo variant="horizontal" size="md" showTagline={true} />
          </div>

          <p className="text-emerald-800 font-medium text-sm mb-3">
            {lang === 'fr'
              ? 'Conseil en investissements financiers • Création d’agents IA & Sites • ESCE Programme Grande École'
              : 'Financial Investment Consulting • AI Agents & Web Creation • ESCE Master Program'}
          </p>

          {/* Contact & Location Strip */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-stone-600">
            <a
              href={`mailto:${MAELANE_DATA.proEmail}`}
              className="flex items-center gap-1.5 text-emerald-950 font-semibold hover:text-emerald-800 transition-colors bg-emerald-50 border border-emerald-300/80 px-2.5 py-1 rounded-lg shadow-2xs"
              title="Email Professionnel & Gestion de Patrimoine"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.proEmail}</span>
              <span className="text-[10px] text-emerald-700 font-bold bg-white px-1.5 py-0.2 rounded">Pro</span>
            </a>
            <div
              className="flex items-center gap-1.5 bg-[#FAF8F5] border border-emerald-600/30 text-emerald-900 font-semibold px-2.5 py-1 rounded-lg"
              title="Paris 17, Lyon 6"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              <span>Paris 17, Lyon 6</span>
            </div>
            <a
              href={`mailto:${MAELANE_DATA.email}`}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors bg-[#FAF8F5] border border-[#E7E2DA] px-2.5 py-1 rounded-lg"
              title="Email ESCE"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.email}</span>
            </a>
            <a
              href={`tel:${MAELANE_DATA.phone.replace(/\./g, '')}`}
              className="flex items-center gap-1.5 hover:text-emerald-700 transition-colors bg-[#FAF8F5] border border-[#E7E2DA] px-2.5 py-1 rounded-lg"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.phone}</span>
            </a>
            <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E7E2DA] px-2.5 py-1 rounded-lg">
              <Car className="w-3.5 h-3.5 text-emerald-700" />
              <span>{MAELANE_DATA.license}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#EFECE6] mt-6 gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'overview'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-emerald-800 hover:bg-[#FAF8F5]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Profil & Atouts Clés' : 'Profile & Key Strengths'}</span>
        </button>

        <button
          onClick={() => setActiveTab('experiences')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'experiences'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-emerald-800 hover:bg-[#FAF8F5]'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Expériences & Émerys' : 'Experience & Émerys'}</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'education'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-emerald-800 hover:bg-[#FAF8F5]'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Formation (ESCE & NYC)' : 'Education (ESCE & NYC)'}</span>
        </button>

        <button
          onClick={() => setActiveTab('travels')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'travels'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-emerald-800 hover:bg-[#FAF8F5]'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Voyages & Monde' : 'World & Travels'}</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'skills'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-emerald-800 hover:bg-[#FAF8F5]'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>{lang === 'fr' ? 'IA, Finance & Outils' : 'AI, Finance & Skills'}</span>
        </button>

        <button
          onClick={() => setActiveTab('associative')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all shrink-0 ${
            activeTab === 'associative'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-stone-600 hover:text-emerald-800 hover:bg-[#FAF8F5]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{lang === 'fr' ? 'Vie Associative' : 'Extracurricular'}</span>
        </button>
      </div>

      {/* TAB CONTENT */}
      <div className="mt-6 space-y-6">
        {/* OVERVIEW / ATOUTS */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* The 3 Differentiators */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs uppercase tracking-wider font-bold text-emerald-800 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700" />
                  <span>{lang === 'fr' ? 'Ce qui différencie Maélane sur le marché du travail' : 'Key Market Differentiators'}</span>
                </h3>
                <span className="text-[11px] text-stone-500 font-medium">Business • Terrain & IA • Entrepreneuriat</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {MAELANE_DATA.keyDifferentiators.map((diff, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4 transition-all hover:border-emerald-600/40 hover:shadow-sm group"
                  >
                    <div className="text-emerald-800 font-bold text-sm mb-0.5 group-hover:text-emerald-700 transition-colors">
                      {diff.title}
                    </div>
                    <div className="text-xs font-semibold text-stone-700 mb-2">
                      {diff.subtitle}
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {diff.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* World Travels & Global Mindset Highlight Card */}
            <div className="bg-[#FAF8F5] border border-emerald-600/30 rounded-xl p-4.5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-emerald-700 text-white rounded-lg shrink-0 mt-0.5">
                  <Globe className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="font-bold text-emerald-950 text-sm">
                      {MAELANE_DATA.worldTravels.title}
                    </h4>
                    <button
                      onClick={() =>
                        onAskAbout(
                          lang === 'fr'
                            ? "Explique-moi l'ouverture au monde de Maélane à travers ses nombreux voyages et son échange à New York."
                            : "Explain Maélane's global mindset through her extensive world travels and New York exchange."
                        )
                      }
                      className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg border border-emerald-300 shadow-2xs"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{lang === 'fr' ? 'Poser la question' : 'Ask'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mb-3">
                    {MAELANE_DATA.worldTravels.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {MAELANE_DATA.worldTravels.destinations.slice(0, 10).map((d, dIdx) => (
                      <span
                        key={dIdx}
                        className="text-[11px] font-medium bg-white text-emerald-900 border border-[#E7E2DA] px-2 py-0.5 rounded-md"
                      >
                        {d.name}
                      </span>
                    ))}
                    <button
                      onClick={() => setActiveTab('travels')}
                      className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline px-1.5 py-0.5"
                    >
                      +{MAELANE_DATA.worldTravels.destinations.length - 10} {lang === 'fr' ? 'autres...' : 'more...'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Fluency & Content Creation Badge */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-emerald-700 text-white rounded-lg shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm mb-1">
                      {lang === 'fr' ? "À l'aise avec l'IA & Création de sites" : "AI Mastery & Web Creation"}
                    </h4>
                    <p className="text-xs text-emerald-950/80 leading-relaxed">
                      {lang === 'fr'
                        ? "Maélane conçoit et configure des agents IA personnalisés, réalise des sites internet modernes et intègre des automatisations intelligentes pour démultiplier l'impact business."
                        : "Maélane creates custom AI agents, builds modern websites, and implements smart automations to scale business efficiency."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-stone-800 text-white rounded-lg shrink-0 mt-0.5">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 text-sm mb-1">
                      {lang === 'fr' ? "Photographie & Sens du détail" : "Photography & Eye for Detail"}
                    </h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {lang === 'fr'
                        ? "Création de contenu soignée, shooting photo et exigence visuelle. Chaque détail compte pour créer une image de marque forte et des présentations clients irréprochables."
                        : "High visual standards in photography and digital content creation, combining artistic sensibility with analytical rigor."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Qualities Summary */}
            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>{lang === 'fr' ? 'Qualités Professionnelles Clés' : 'Core Professional Qualities'}</span>
              </h4>
              <p className="text-xs font-semibold text-stone-800 mb-3 bg-white p-2.5 rounded-lg border border-[#E7E2DA]">
                {MAELANE_DATA.qualitiesSummary}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-600">
                {MAELANE_DATA.qualities.map((q, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <span className="text-emerald-700 font-bold mt-0.5">•</span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXPERIENCES */}
        {activeTab === 'experiences' && (
          <div className="space-y-4">
            <div className="bg-emerald-50/50 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
              <span className="font-semibold">
                {lang === 'fr'
                  ? 'Environ 2 ans d’expérience cumulée en gestion de patrimoine, stages et entrepreneuriat'
                  : '~2 years cumulative experience in wealth management, internships & entrepreneurship'}
              </span>
              <span className="text-emerald-800 font-medium">Inovéa • Filianse • SCPI • PER</span>
            </div>

            {MAELANE_DATA.experiences.map((exp, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4.5 transition-all hover:border-emerald-600/40 hover:bg-white group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-stone-900 font-bold text-sm group-hover:text-emerald-800 transition-colors">
                      {exp.role}
                    </h3>
                    <div className="text-emerald-700 text-xs font-semibold">
                      {exp.company}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-500 text-xs bg-white border border-[#E7E2DA] px-2.5 py-0.5 rounded-md font-medium">
                      {exp.period}
                    </span>
                    <button
                      onClick={() =>
                        onAskAbout(
                          lang === 'fr'
                            ? `Peux-tu m'expliquer en détail l'expérience de Maélane chez ${exp.company} ?`
                            : `Can you explain Maélane's experience at ${exp.company} in detail?`
                        )
                      }
                      className="px-2 py-1 text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{lang === 'fr' ? 'Détails' : 'Ask'}</span>
                    </button>
                  </div>
                </div>

                {exp.company.includes('Émerys') && (
                  <div className="my-3 py-3 px-4 bg-emerald-50/50 border border-emerald-600/30 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-2xs">
                    <EmerysLogo variant="horizontal" size="lg" showTagline={false} />
                    <span className="text-xs font-bold text-emerald-900 bg-white px-3 py-1 rounded-full border border-emerald-200/80 shadow-2xs">
                      {lang === 'fr' ? 'Fondatrice d’Émerys Conseil' : 'Founder of Émerys Conseil'}
                    </span>
                  </div>
                )}

                <ul className="space-y-1.5 mt-2.5">
                  {exp.responsibilities.map((resp, rIdx) => (
                    <li key={rIdx} className="text-xs text-stone-600 flex items-start gap-2 leading-relaxed">
                      <span className="text-emerald-700 mt-1 font-bold">•</span>
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>

                {exp.tools && (
                  <div className="mt-3 pt-2.5 border-t border-[#EFECE6] flex flex-wrap gap-1.5">
                    {exp.tools.map((t, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION — Inclus Monaco, Baruch NY & ESCE */}
        {activeTab === 'education' && (
          <div className="space-y-4">
            {MAELANE_DATA.education.map((edu, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4.5 transition-all hover:border-emerald-600/40 hover:bg-white group"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div>
                    <h3 className="text-stone-900 font-bold text-sm group-hover:text-emerald-800 transition-colors">
                      {edu.institution}
                    </h3>
                    <div className="text-emerald-700 text-xs font-semibold">{edu.degree}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-stone-600 text-xs bg-white border border-emerald-600/30 px-2.5 py-0.5 rounded-md font-semibold text-emerald-950">
                      {edu.period}
                    </span>
                    <button
                      onClick={() =>
                        onAskAbout(
                          lang === 'fr'
                            ? `Parle-moi de la formation de Maélane à ${edu.institution} (notamment son échange de 6 mois à New York à Baruch College ou son échange à Monaco).`
                            : `Tell me about Maélane's education at ${edu.institution} (including her 6-month NYC exchange at Baruch College or Monaco).`
                        )
                      }
                      className="px-2 py-1 text-emerald-800 hover:text-emerald-950 bg-emerald-100/80 hover:bg-emerald-200 rounded-lg transition-colors flex items-center gap-1 text-xs font-medium"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{lang === 'fr' ? 'Détails' : 'Ask'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-xs text-stone-600 mb-2 leading-relaxed">{edu.description}</p>

                {edu.highlights && (
                  <div className="space-y-1.5 pl-2.5 border-l-2 border-emerald-600/60 mt-2">
                    {edu.highlights.map((h, hIdx) => (
                      <p key={hIdx} className="text-xs text-stone-700 leading-relaxed">
                        {h}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* TRAVELS & WORLD INNOVATIONS */}
        {activeTab === 'travels' && (
          <div className="space-y-5">
            <div className="bg-emerald-50/70 border border-emerald-200/90 rounded-xl p-4.5">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <Plane className="w-5 h-5 text-emerald-700" />
                  <h3 className="text-sm font-bold text-emerald-950">
                    {MAELANE_DATA.worldTravels.title}
                  </h3>
                </div>
                <button
                  onClick={() =>
                    onAskAbout(
                      lang === 'fr'
                        ? "Quels pays Maélane a-t-elle visités et comment cela nourrit-il sa vision des innovations et des besoins dans le monde ?"
                        : "Which countries has Maélane visited, and how does it fuel her vision of world innovations and societal needs?"
                    )
                  }
                  className="px-2.5 py-1 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg flex items-center gap-1 shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{lang === 'fr' ? 'Écouter l’assistant' : 'Ask Assistant'}</span>
                </button>
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {MAELANE_DATA.worldTravels.description}
              </p>
            </div>

            <div className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>{lang === 'fr' ? 'Destinations & Expériences Internationales' : 'Destinations & International Footprint'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {MAELANE_DATA.worldTravels.destinations.map((dest, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-[#E7E2DA] hover:border-emerald-600/40 p-2.5 rounded-xl transition-all shadow-2xs flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-stone-900">{dest.name}</span>
                    <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                      {dest.region}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* SKILLS — IA, Finance & Outils */}
        {activeTab === 'skills' && (
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MAELANE_DATA.technicalSkills.map((cat, idx) => (
                <div key={idx} className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-stone-900">{cat.domain}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        cat.domain.includes('Intelligence')
                          ? 'bg-emerald-600 text-white'
                          : cat.type === 'Pratique (Terrain)'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200/80 text-stone-700'
                      }`}
                    >
                      {cat.type}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {cat.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="bg-white text-emerald-900 border border-[#E7E2DA] text-xs px-2.5 py-1 rounded-lg font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">
                {lang === 'fr' ? 'Langues' : 'Languages'}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {MAELANE_DATA.languages.map((l, idx) => (
                  <div
                    key={idx}
                    className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-3 flex items-center gap-3"
                  >
                    <span className="text-2xl">{l.flag}</span>
                    <div>
                      <div className="text-stone-900 text-xs font-bold">{l.language}</div>
                      <div className="text-stone-500 text-[11px]">{l.level}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ASSOCIATIVE */}
        {activeTab === 'associative' && (
          <div className="space-y-3.5">
            {MAELANE_DATA.associative.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#FAF8F5] border border-[#E7E2DA] rounded-xl p-4 transition-all hover:border-emerald-600/40 hover:bg-white"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <h3 className="text-stone-900 font-bold text-sm">{item.title}</h3>
                  <span className="text-stone-500 text-xs bg-white border border-[#E7E2DA] px-2 py-0.5 rounded">
                    {item.period}
                  </span>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
