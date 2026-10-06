import React from 'react';
import { X, Cpu, Sparkles, Layers, Zap, ShieldCheck } from 'lucide-react';
import { CAT_CLASSES, CLASS_COLORS, CAT_BREED_INFO } from '../utils/catBreedsData';

export function ModelInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-[#151c2c] border border-[#232e42] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232e42] flex items-center justify-between bg-[#0b0f19]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Spesifikasi & Cara Kerja Model
              </h3>
              <p className="text-[11px] text-slate-400">
                YOLOv8 Nano dijalankan langsung di browsermu via ONNX Runtime Web
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl">
              <span className="text-[11px] text-slate-400 block">Arsitektur</span>
              <p className="text-sm font-bold text-orange-400 font-mono">YOLOv8 Nano</p>
              <span className="text-[10px] text-slate-500">Ultralytics CV</span>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl">
              <span className="text-[11px] text-slate-400 block">Ukuran File</span>
              <p className="text-sm font-bold text-amber-400 font-mono">11.68 MB</p>
              <span className="text-[10px] text-slate-500">Format ONNX</span>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl">
              <span className="text-[11px] text-slate-400 block">Ukuran Input</span>
              <p className="text-sm font-bold text-cyan-400 font-mono">640 × 640</p>
              <span className="text-[10px] text-slate-500">RGB Letterbox</span>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl">
              <span className="text-[11px] text-slate-400 block">Kelas Ras</span>
              <p className="text-sm font-bold text-emerald-400 font-mono">14 Kucing</p>
              <span className="text-[10px] text-slate-500">Dataset Ras Kucing</span>
            </div>
          </div>

          {/* Architecture Rationale */}
          <div className="p-4 bg-[#0b0f19] border border-[#232e42] rounded-xl space-y-2 text-xs">
            <h4 className="font-bold text-orange-400 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Kenapa Diproses Langsung di Browser?
            </h4>
            <p className="text-slate-300 leading-relaxed">
              Karena modelnya dikonversi ke format <strong>ONNX Web</strong>, deteksi objek langsung diproses oleh perangkatmu sendiri. Nggak ada foto atau video yang diunggah ke server backend, jadi prosesnya instan dan privasimu terjaga seutuhnya.
            </p>
          </div>

          {/* Technical Pipeline */}
          <div className="space-y-3 text-xs">
            <h4 className="font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              Tahapan Cara Kerja Model
            </h4>
            <div className="space-y-2.5">
              <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">1</span>
                <div>
                  <strong className="text-slate-200">Menyesuaikan Foto (Letterboxing):</strong> Gambar diperkecil rapi ke ukuran 640×640 px dengan latar abu-abu agar proporsi kucing tidak berubah, lalu diubah menjadi format angka yang dipahami model.
                </div>
              </div>

              <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="text-slate-200">Perhitungan Model ONNX:</strong> Model memindai seluruh bagian gambar dan menghitung kemungkinan dari 14 ras kucing yang dilatih.
                </div>
              </div>

              <div className="p-3 bg-[#0b0f19] border border-[#232e42] rounded-xl flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="text-slate-200">Penyaringan Kotak (NMS):</strong> Kotak deteksi yang bertumpuk disaring secara otomatis, lalu diambil hasil terbaik sesuai pengaturan sensitivitas yang kamu tentukan.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0b0f19] border-t border-[#232e42] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

export function BreedCatalogModal({ isOpen, onClose, onSelectBreed }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#151c2c] border border-[#232e42] rounded-2xl overflow-hidden max-h-[90vh] flex flex-col shadow-2xl text-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#232e42] flex items-center justify-between bg-[#0b0f19]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Katalog 14 Ras Kucing yang Dikenali Model
              </h3>
              <p className="text-[11px] text-slate-400">
                Klik salah satu ras kucing di bawah ini untuk melihat detail karakteristik dan sifatnya
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {CAT_CLASSES.map((breedName, idx) => {
            const info = CAT_BREED_INFO[breedName] || {};
            const color = CLASS_COLORS[breedName] || '#f97316';

            return (
              <div
                key={breedName}
                onClick={() => {
                  onSelectBreed(breedName);
                }}
                className="group p-4 bg-[#0b0f19] hover:bg-slate-800/80 border border-[#232e42] hover:border-slate-700 rounded-xl transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <h4 className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition">
                        {info.displayName || breedName}
                      </h4>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{idx + 1}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                    {info.description}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-[#232e42]">
                  <span className="truncate max-w-[140px]">{info.origin}</span>
                  <span className="text-orange-400 font-medium group-hover:translate-x-0.5 transition">Detail →</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#0b0f19] border-t border-[#232e42] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}


