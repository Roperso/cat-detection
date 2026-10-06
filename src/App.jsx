import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ImageDetector from './components/ImageDetector';
import WebcamDetector from './components/WebcamDetector';
import BreedDetailModal from './components/BreedDetailModal';
import { ModelInfoModal, BreedCatalogModal } from './components/ModelInfoModal';
import { Sparkles, Camera, Image as ImageIcon, Cpu, Layers, ShieldCheck } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('image'); // 'image' or 'webcam'
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-orange-500 selection:text-white">

      {/* Top Navigation */}
      <Navbar
        onOpenInfo={() => setIsInfoModalOpen(true)}
        onOpenCatalog={() => setIsCatalogModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* Friendly Hero Header */}
        <div className="bg-[#151c2c] border border-[#232e42] rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Computer Vision Showcase</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Deteksi & Klasifikasi 14 Ras Kucing Realtime
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed">
                Aplikasi deteksi ras kucing berbasis <strong>YOLOv8</strong> yang dikonversi ke <strong>ONNX WebAssembly</strong>. Seluruh komputasi berjalan 100% lokal di browser Anda — tanpa mengirim foto atau video ke server.
              </p>
            </div>

            {/* Quick Spec Cards */}
            <div className="grid grid-cols-2 gap-2.5 shrink-0 min-w-[260px] text-xs">
              <div className="p-3 bg-[#0b0f19]/80 border border-[#232e42] rounded-xl">
                <span className="text-slate-400 text-[11px] block">Model Architecture</span>
                <span className="font-bold text-orange-400 font-mono">YOLOv8 Nano</span>
              </div>
              <div className="p-3 bg-[#0b0f19]/80 border border-[#232e42] rounded-xl">
                <span className="text-slate-400 text-[11px] block">Execution Engine</span>
                <span className="font-bold text-cyan-400 font-mono">ONNX Web</span>
              </div>
              <div className="p-3 bg-[#0b0f19]/80 border border-[#232e42] rounded-xl">
                <span className="text-slate-400 text-[11px] block">Jumlah Ras</span>
                <span className="font-bold text-amber-400 font-mono">14 Kelas</span>
              </div>
              <div className="p-3 bg-[#0b0f19]/80 border border-[#232e42] rounded-xl">
                <span className="text-slate-400 text-[11px] block">Keamanan Data</span>
                <span className="font-bold text-emerald-400 font-mono">100% Private</span>
              </div>
            </div>

          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-[#151c2c] border border-[#232e42] rounded-xl">
            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${activeTab === 'image'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Gambar & Sampel Foto</span>
            </button>

            <button
              onClick={() => setActiveTab('webcam')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition ${activeTab === 'webcam'
                  ? 'bg-orange-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
            >
              <Camera className="w-4 h-4" />
              <span>Live Kamera Realtime</span>
            </button>
          </div>

          <span className="text-xs text-slate-400 font-medium self-center">
            Mode Aktif: <strong className="text-white">{activeTab === 'image' ? 'Analisis File Foto' : 'Deteksi Kamera Web'}</strong>
          </span>
        </div>

        {/* Detector Workspace */}
        <div className="transition-opacity duration-200">
          {activeTab === 'image' ? (
            <ImageDetector onSelectBreed={(breed) => setSelectedBreed(breed)} />
          ) : (
            <WebcamDetector onSelectBreed={(breed) => setSelectedBreed(breed)} />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#232e42] bg-[#0b0f19] py-6 text-xs text-slate-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>
            CatLens AI — Computer Vision Cat Breed Detection Project
          </p>
          <p className="text-slate-500">
            Dibuat dengan YOLOv8, ONNX Runtime Web, React, & Tailwind CSS.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <BreedDetailModal
        breedName={selectedBreed}
        isOpen={!!selectedBreed}
        onClose={() => setSelectedBreed(null)}
      />

      <ModelInfoModal
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />

      <BreedCatalogModal
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onSelectBreed={(breed) => {
          setIsCatalogModalOpen(false);
          setSelectedBreed(breed);
        }}
      />

    </div>
  );
}


