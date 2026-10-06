import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sliders, Image as ImageIcon, Download, RefreshCw, Sparkles, ChevronRight, Zap } from 'lucide-react';
import { detectObjects, loadModel } from '../utils/yoloHelper';
import { CLASS_COLORS, CAT_BREED_INFO } from '../utils/catBreedsData';

const SAMPLE_IMAGES = [
  { name: 'Abyssinian', path: '/samples/Abyssinian_sample.jpg', label: 'Abyssinian' },
  { name: 'Bengal', path: '/samples/Bengal_sample.jpg', label: 'Bengal' },
  { name: 'British_Shorthair', path: '/samples/British_Shorthair_sample.jpg', label: 'British Shorthair' },
  { name: 'Maine_Coon', path: '/samples/Maine_Coon_sample.jpg', label: 'Maine Coon' },
  { name: 'Persian', path: '/samples/Persian_sample.jpg', label: 'Persia' },
  { name: 'Ragdoll', path: '/samples/Ragdoll_sample.jpg', label: 'Ragdoll' },
  { name: 'Siamese', path: '/samples/Siamese_sample.jpg', label: 'Siamese' },
  { name: 'Sphynx', path: '/samples/Sphynx_sample.jpg', label: 'Sphynx' },
];

export default function ImageDetector({ onSelectBreed }) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detections, setDetections] = useState([]);
  const [inferenceStats, setInferenceStats] = useState(null);
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [isModelReady, setIsModelReady] = useState(false);

  const imageRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Preload model on mount
  useEffect(() => {
    loadModel((status) => setLoadingStatus(status))
      .then(() => setIsModelReady(true))
      .catch((err) => console.error('Model load error:', err));
  }, []);

  // Run detection whenever image or threshold changes
  const runDetection = async (imgElement = imageRef.current) => {
    if (!imgElement || !imgElement.complete || imgElement.naturalWidth === 0) return;

    setIsProcessing(true);
    try {
      const result = await detectObjects(imgElement, confThreshold, iouThreshold);
      setDetections(result.detections);
      setInferenceStats({
        timeMs: result.inferenceTime,
        boxesCount: result.detections.length,
        width: result.origWidth,
        height: result.origHeight
      });

      drawBoundingBoxes(imgElement, result.detections);
    } catch (err) {
      console.error('Detection failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Re-detect on threshold slider change if image exists
  useEffect(() => {
    if (imageSrc && imageRef.current) {
      runDetection();
    }
  }, [confThreshold, iouThreshold]);

  // Handle image load
  const handleImageLoaded = () => {
    runDetection();
  };

  // Handle file select
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target.result);
      setDetections([]);
    };
    reader.readAsDataURL(file);
  };

  // Handle sample click
  const handleSelectSample = (samplePath) => {
    setImageSrc(samplePath);
    setDetections([]);
  };

  // Draw bounding boxes on Canvas
  const drawBoundingBoxes = (img, boxes) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach((box) => {
      const color = CLASS_COLORS[box.className] || '#f97316';
      const percentage = Math.round(box.score * 100);

      // Clean vector bounding box
      const strokeW = Math.max(3, Math.round(canvas.width / 300));
      ctx.lineWidth = strokeW;
      ctx.strokeStyle = color;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Label badge
      const labelText = `${box.className} (${percentage}%)`;
      const fontSize = Math.max(13, Math.round(canvas.width / 45));
      ctx.font = `bold ${fontSize}px "Plus Jakarta Sans", sans-serif`;

      const textMetrics = ctx.measureText(labelText);
      const textWidth = textMetrics.width;
      const textHeight = fontSize * 1.2;
      const padding = 6;

      const badgeY = box.y - textHeight - padding > 0 ? box.y - textHeight - padding : box.y;

      ctx.fillStyle = color;
      ctx.fillRect(box.x, badgeY, textWidth + padding * 2, textHeight + padding);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(labelText, box.x + padding, badgeY + textHeight - 2);
    });
  };

  // Download annotated image
  const handleDownload = () => {
    const img = imageRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const downloadCanvas = document.createElement('canvas');
    downloadCanvas.width = img.naturalWidth;
    downloadCanvas.height = img.naturalHeight;
    const ctx = downloadCanvas.getContext('2d');

    ctx.drawImage(img, 0, 0);
    ctx.drawImage(canvas, 0, 0);

    const link = document.createElement('a');
    link.download = `catlens_anotasi_${Date.now()}.jpg`;
    link.href = downloadCanvas.toDataURL('image/jpeg', 0.95);
    link.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Quick Test Sample Bar */}
      <div className="p-4 bg-[#151c2c] border border-[#232e42] rounded-2xl space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-200 font-semibold">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Coba Sampel Foto Kucing (1-Click Test):</span>
          </div>
          <span className="text-slate-400 text-[11px]">8 Sampel Ras</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {SAMPLE_IMAGES.map((s, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectSample(s.path)}
              className="group relative rounded-xl overflow-hidden aspect-square border border-[#232e42] hover:border-orange-500 transition focus:outline-none"
            >
              <img
                src={s.path}
                alt={s.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-x-0 bottom-0 bg-black/80 p-1">
                <span className="text-[10px] font-medium text-white truncate block group-hover:text-orange-300">
                  {s.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Detector Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Image Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative min-h-[380px] sm:min-h-[480px] bg-[#151c2c] border border-[#232e42] rounded-2xl flex flex-col items-center justify-center p-4 overflow-hidden">
            
            {imageSrc ? (
              <div className="relative max-w-full max-h-[580px] flex items-center justify-center rounded-xl overflow-hidden bg-black shadow-lg">
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Target Cat"
                  onLoad={handleImageLoaded}
                  className="max-w-full max-h-[580px] object-contain block"
                  crossOrigin="anonymous"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                />

                {isProcessing && (
                  <div className="absolute inset-0 bg-black/70 backdrop-blur-xs flex flex-col items-center justify-center gap-3 text-xs">
                    <div className="w-8 h-8 border-3 border-orange-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-orange-400 font-semibold">
                      Menjalankan Inferensi YOLOv8...
                    </span>
                  </div>
                )}
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer text-center p-8 max-w-md flex flex-col items-center gap-4 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition duration-300">
                  <Upload className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">
                    Upload Foto Kucing Anda
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Klik di sini atau drag & drop file gambar (JPG, PNG). Model akan mendeteksi ras kucing secara otomatis di browser Anda.
                  </p>
                </div>
                <button className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition shadow-md">
                  Pilih File Foto
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Action Toolbar */}
          {imageSrc && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#151c2c] border border-[#232e42] rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg transition flex items-center gap-1.5 font-medium border border-slate-800"
                >
                  <Upload className="w-3.5 h-3.5" /> Ganti Foto
                </button>

                <button
                  onClick={() => runDetection()}
                  disabled={isProcessing}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 rounded-lg transition flex items-center gap-1.5 font-medium border border-slate-800 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isProcessing ? 'animate-spin' : ''}`} /> Deteksi Ulang
                </button>
              </div>

              <button
                onClick={handleDownload}
                disabled={detections.length === 0}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white font-semibold rounded-lg transition flex items-center gap-1.5 shadow-md"
              >
                <Download className="w-3.5 h-3.5" /> Unduh Hasil Anotasi
              </button>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Control Parameters & Detection Results */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Sliders Card */}
          <div className="p-5 bg-[#151c2c] border border-[#232e42] rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#232e42] pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>Pengaturan Parameter</span>
              </div>
              <span className="text-[10px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded-md font-mono">
                Interactive
              </span>
            </div>

            {/* Confidence Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">Confidence Threshold</span>
                <span className="text-orange-400 font-bold font-mono">
                  {Math.round(confThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={confThreshold}
                onChange={(e) => setConfThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-[11px] text-slate-400">
                Tingkat keyakinan minimum agar deteksi ditampilkan.
              </p>
            </div>

            {/* IoU NMS Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">IoU / NMS Threshold</span>
                <span className="text-cyan-400 font-bold font-mono">
                  {Math.round(iouThreshold * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.10"
                max="0.90"
                step="0.05"
                value={iouThreshold}
                onChange={(e) => setIouThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
              <p className="text-[11px] text-slate-400">
                Penyaring kotak tumpang tindih (NMS).
              </p>
            </div>

            {/* Benchmark Latency Tag */}
            {inferenceStats && (
              <div className="pt-3 border-t border-[#232e42] flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  Kecepatan Inferensi:
                </span>
                <span className="font-mono font-bold text-slate-200">
                  {inferenceStats.timeMs} ms
                </span>
              </div>
            )}
          </div>

          {/* Detections List Panel */}
          <div className="p-5 bg-[#151c2c] border border-[#232e42] rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#232e42] pb-3">
              <h4 className="font-bold text-white">Hasil Deteksi Ras</h4>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {detections.length} Terdeteksi
              </span>
            </div>

            {detections.length > 0 ? (
              <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
                {detections.map((det, index) => {
                  const color = CLASS_COLORS[det.className] || '#f97316';
                  const percentage = Math.round(det.score * 100);
                  const breed = CAT_BREED_INFO[det.className] || {};

                  return (
                    <div
                      key={index}
                      onClick={() => onSelectBreed(det.className)}
                      className="group p-3.5 rounded-xl bg-[#0b0f19] hover:bg-slate-800/80 border border-[#232e42] hover:border-slate-700 transition cursor-pointer space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-bold text-sm text-slate-100 group-hover:text-orange-400 transition">
                            {breed.displayName || det.className}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-orange-400">
                          {percentage}%
                        </span>
                      </div>

                      {/* Confidence Meter Bar */}
                      <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: color
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Asal: {breed.origin || '-'}</span>
                        <span className="text-orange-400 flex items-center gap-0.5 group-hover:translate-x-0.5 transition font-medium">
                          Lihat Karakteristik <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400 text-xs">
                {imageSrc ? 'Tidak ada ras yang memenuhi threshold saat ini.' : 'Belum ada gambar yang dipilih.'}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}


