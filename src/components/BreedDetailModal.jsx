import React from 'react';
import { X, MapPin, Heart, Clock, Layers } from 'lucide-react';
import { CAT_BREED_INFO, CLASS_COLORS } from '../utils/catBreedsData';

export default function BreedDetailModal({ breedName, isOpen, onClose }) {
  if (!isOpen || !breedName) return null;

  const breed = CAT_BREED_INFO[breedName] || {
    name: breedName,
    displayName: breedName,
    origin: 'Informasi umum',
    temperament: 'Kucing peliharaan',
    lifespan: '10 - 15 Tahun',
    coat: 'Standar',
    description: 'Informasi detail untuk ras ini sedang diperbarui.',
    traits: ['Kucing', 'Ramah']
  };

  const themeColor = CLASS_COLORS[breedName] || '#f97316';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#151c2c] border border-[#232e42] rounded-2xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Accent Bar */}
        <div 
          className="h-2 w-full"
          style={{ backgroundColor: themeColor }}
        />

        <div className="p-6 space-y-5">
          {/* Header Title & Close */}
          <div className="flex items-start justify-between gap-4 border-b border-[#232e42] pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span 
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ backgroundColor: themeColor }}
                />
                <h3 className="text-xl font-bold text-white tracking-tight">
                  {breed.displayName}
                </h3>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                Asal: <span className="text-slate-200 font-medium">{breed.origin}</span>
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="p-4 bg-[#0b0f19] border border-[#232e42] rounded-xl text-xs sm:text-sm text-slate-300 leading-relaxed">
            {breed.description}
          </div>

          {/* Key Traits Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                <span>Temperamen / Sifat</span>
              </div>
              <p className="font-semibold text-slate-200">
                {breed.temperament}
              </p>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Harapan Hidup</span>
              </div>
              <p className="font-semibold text-slate-200">
                {breed.lifespan}
              </p>
            </div>

            <div className="col-span-2 p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span>Karakteristik Bulu (Coat)</span>
              </div>
              <p className="text-slate-200">
                {breed.coat}
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {breed.traits && breed.traits.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-slate-900 text-slate-300 rounded-lg border border-slate-800"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0b0f19] border-t border-[#232e42] flex justify-end text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold rounded-xl transition shadow-md"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}


