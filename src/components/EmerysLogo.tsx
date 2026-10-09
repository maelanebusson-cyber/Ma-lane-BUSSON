import React, { useState, useRef } from 'react';
import { Upload } from 'lucide-react';
import defaultOfficialLogo from '../assets/images/official_emerys_logo.png';

interface EmerysLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  variant?: 'horizontal' | 'vertical' | 'badge' | 'icon' | string;
}

export const EmerysLogo: React.FC<EmerysLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const [officialLogo, setOfficialLogo] = useState<string>(() => {
    return localStorage.getItem('emerys_official_logo_v2') || defaultOfficialLogo;
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      setOfficialLogo(base64);
      localStorage.setItem('emerys_official_logo_v2', base64);

      try {
        await fetch('/api/upload-logo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        });
      } catch (err) {
        console.error('Error syncing official logo:', err);
      }
    };
    reader.readAsDataURL(file);
  };

  const imgHeight = size === 'sm' ? 'h-7' : size === 'lg' ? 'h-14' : 'h-10';

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* If user uploaded the official logo, display it without modification */}
      {officialLogo ? (
        <div className="relative group">
          <img
            src={officialLogo}
            alt="Émerys Conseil"
            className={`${imgHeight} w-auto object-contain transition-transform group-hover:scale-105`}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 rounded-md transition-opacity flex items-center justify-center text-white text-[9px] font-medium"
            title="Changer le logo officiel"
          >
            Changer
          </button>
        </div>
      ) : (
        /* If no logo uploaded yet: no generated image, clean discreet badge with upload option */
        <div className="flex items-center gap-2">
          <span className="font-serif font-extrabold text-stone-900 tracking-wider text-base sm:text-lg">
            ÉMERYS CONSEIL
          </span>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="text-[10px] text-stone-400 hover:text-emerald-800 flex items-center gap-1 border border-dashed border-[#E7E2DA] hover:border-emerald-500 px-2 py-0.5 rounded-lg transition-colors"
            title="Importer mon logo officiel ÉmerysConseilLOGO.png"
          >
            <Upload className="w-3 h-3 text-emerald-700" />
            <span>Logo PNG</span>
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleLogoUpload}
        className="hidden"
      />

      {showTagline && (
        <span className="bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap shadow-2xs">
          Fondatrice d’Émerys Conseil
        </span>
      )}
    </div>
  );
};
