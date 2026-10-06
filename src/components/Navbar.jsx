import React from 'react';
import { Info, Sparkles } from 'lucide-react';

export default function Navbar({ onOpenInfo, onOpenCatalog }) {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
        
        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold text-sm sm:text-base shrink-0">
            🐾
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm sm:text-base text-white tracking-tight font-sans whitespace-nowrap">
              CatLens AI
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 hidden md:inline-block whitespace-nowrap">
              YOLOv8 • ONNX
            </span>
          </div>
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 text-xs shrink-0">
          <button
            onClick={onOpenCatalog}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition font-medium whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Daftar 14 Ras</span>
            <span className="sm:hidden">Ras</span>
          </button>

          <button
            onClick={onOpenInfo}
            className="flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 transition font-medium whitespace-nowrap"
          >
            <Info className="w-3.5 h-3.5 text-orange-400 shrink-0" />
            <span className="hidden sm:inline">Tentang Model</span>
            <span className="sm:hidden">Info</span>
          </button>

          <div className="h-4 w-px bg-slate-800 hidden md:block" />

          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium whitespace-nowrap">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <span>Jalan Langsung di Browser</span>
          </div>
        </div>

      </div>
    </header>
  );
}



