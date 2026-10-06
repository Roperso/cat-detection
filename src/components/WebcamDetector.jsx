import React, { useState, useRef, useEffect } from 'react';
import { Camera, CameraOff, RefreshCw, Sliders, Video, AlertCircle, Zap } from 'lucide-react';
import { detectObjects, loadModel } from '../utils/yoloHelper';
import { CLASS_COLORS, CAT_BREED_INFO } from '../utils/catBreedsData';

export default function WebcamDetector({ onSelectBreed }) {
  const [isStreaming, setIsStreaming] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const [detections, setDetections] = useState([]);
  const [confThreshold, setConfThreshold] = useState(0.25);
  const [iouThreshold, setIouThreshold] = useState(0.45);
  const [cameraFacing, setCameraFacing] = useState('user'); // 'user' or 'environment'
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isDetectingRef = useRef(false);
  const lastFrameTimeRef = useRef(performance.now());
  const frameCountRef = useRef(0);

  // Preload model
  useEffect(() => {
    loadModel()
      .then(() => setIsModelReady(true))
      .catch((err) => {
        console.error('Failed to load model:', err);
        setErrorMessage('Gagal memuat session ONNX Runtime Web. Silakan muat ulang halaman.');
      });

    return () => {
      stopCamera();
    };
  }, []);

  // Start Camera
  const startCamera = async () => {
    setErrorMessage('');
    try {
      // Ensure model is ready
      await loadModel();
      setIsModelReady(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: cameraFacing,
          width: { ideal: 640 },
          height: { ideal: 480 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play();
          setIsStreaming(true);
          startDetectionLoop();
        };
      }
    } catch (err) {
      console.error('Webcam / Model start error:', err);
      if (err.message && err.message.includes('ONNX')) {
        setErrorMessage('Gagal memuat session ONNX Runtime Web. Periksa koneksi internet Anda.');
      } else {
        setErrorMessage('Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan di browser.');
      }
    }
  };

  // Stop Camera
  const stopCamera = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    setIsStreaming(false);
    setDetections([]);
    setFps(0);

    // Clear canvas
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  // Detection loop
  const startDetectionLoop = () => {
    const loop = async () => {
      if (!videoRef.current || videoRef.current.paused || videoRef.current.ended) {
        return;
      }

      if (!isDetectingRef.current && videoRef.current.readyState >= 2) {
        isDetectingRef.current = true;

        try {
          const result = await detectObjects(videoRef.current, confThreshold, iouThreshold);
          setDetections(result.detections);
          setLatency(result.inferenceTime);

          drawOverlay(videoRef.current, result.detections);

          // Calculate FPS
          frameCountRef.current++;
          const now = performance.now();
          if (now - lastFrameTimeRef.current >= 1000) {
            setFps(Math.round((frameCountRef.current * 1000) / (now - lastFrameTimeRef.current)));
            frameCountRef.current = 0;
            lastFrameTimeRef.current = now;
          }
        } catch (e) {
          console.error('Frame detection error:', e);
        } finally {
          isDetectingRef.current = false;
        }
      }

      animationFrameRef.current = requestAnimationFrame(loop);
    };

    animationFrameRef.current = requestAnimationFrame(loop);
  };

  // Draw overlay bounding boxes
  const drawOverlay = (video, boxes) => {
    const canvas = canvasRef.current;
    if (!canvas || !video) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    boxes.forEach((box) => {
      const color = CLASS_COLORS[box.className] || '#f97316';
      const percentage = Math.round(box.score * 100);

      // Bounding box
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.strokeRect(box.x, box.y, box.width, box.height);

      // Label badge
      const label = `${box.className} (${percentage}%)`;
      ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
      const textMetrics = ctx.measureText(label);
      const padding = 5;

      const badgeY = box.y - 22 > 0 ? box.y - 22 : box.y;
      ctx.fillStyle = color;
      ctx.fillRect(box.x, badgeY, textMetrics.width + padding * 2, 20);

      ctx.fillStyle = '#ffffff';
      ctx.fillText(label, box.x + padding, badgeY + 14);
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Alert Error if camera not accessible */}
      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Webcam Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Video Feed Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative min-h-[380px] sm:min-h-[480px] bg-[#151c2c] border border-[#232e42] rounded-2xl flex flex-col items-center justify-center overflow-hidden">
            
            <video
              ref={videoRef}
              playsInline
              muted
              className={`max-w-full max-h-[540px] rounded-xl object-contain ${isStreaming ? 'block' : 'hidden'}`}
            />
            
            <canvas
              ref={canvasRef}
              className={`absolute inset-0 w-full h-full object-contain pointer-events-none ${isStreaming ? 'block' : 'hidden'}`}
            />

            {!isStreaming && (
              <div className="text-center p-8 max-w-sm flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
                  <Camera className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base mb-1">
                    Deteksi Realtime Kamera Web
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Arahkan kamera ke kucing untuk melakukan pemindaian ras secara terus-menerus.
                  </p>
                </div>
                <button
                  onClick={startCamera}
                  className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold transition flex items-center gap-2 shadow-md"
                >
                  <Video className="w-4 h-4" /> Mulai Kamera Web
                </button>
              </div>
            )}

            {/* Live Stats Overlay */}
            {isStreaming && (
              <div className="absolute top-4 left-4 flex items-center gap-2 text-xs font-mono">
                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-slate-700 text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  REC • {fps} FPS
                </span>
                <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-slate-700 text-amber-400">
                  {latency} ms
                </span>
              </div>
            )}
          </div>

          {/* Camera Controls Bar */}
          {isStreaming && (
            <div className="flex items-center justify-between p-3 bg-[#151c2c] border border-[#232e42] rounded-xl text-xs">
              <button
                onClick={stopCamera}
                className="px-4 py-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 transition flex items-center gap-1.5 font-semibold"
              >
                <CameraOff className="w-3.5 h-3.5" /> Hentikan Kamera
              </button>

              <button
                onClick={() => {
                  stopCamera();
                  setCameraFacing((prev) => (prev === 'user' ? 'environment' : 'user'));
                  setTimeout(() => startCamera(), 300);
                }}
                className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition flex items-center gap-1.5 font-medium"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Putar Kamera
              </button>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Control Sliders & Live Results */}
        <div className="lg:col-span-4 space-y-4">
          
          <div className="p-5 bg-[#151c2c] border border-[#232e42] rounded-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-[#232e42] pb-3">
              <div className="flex items-center gap-2 text-white font-bold">
                <Sliders className="w-4 h-4 text-orange-400" />
                <span>Parameter Sensitivitas</span>
              </div>
            </div>

            {/* Confidence Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
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
            </div>

            {/* IoU Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300">IoU Threshold</span>
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
            </div>
          </div>

          {/* Live Detected List */}
          <div className="p-5 bg-[#151c2c] border border-[#232e42] rounded-2xl space-y-3 text-xs">
            <div className="flex items-center justify-between border-b border-[#232e42] pb-3">
              <h4 className="font-bold text-white">Target Terdeteksi</h4>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/20">
                {detections.length} Target
              </span>
            </div>

            {detections.length > 0 ? (
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                {detections.map((det, index) => {
                  const color = CLASS_COLORS[det.className] || '#f97316';
                  const percentage = Math.round(det.score * 100);
                  const breed = CAT_BREED_INFO[det.className] || {};

                  return (
                    <div
                      key={index}
                      onClick={() => onSelectBreed(det.className)}
                      className="p-3.5 rounded-xl bg-[#0b0f19] hover:bg-slate-800/80 border border-[#232e42] hover:border-slate-700 transition cursor-pointer space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: color }}
                          />
                          <span className="font-bold text-sm text-slate-100">
                            {breed.displayName || det.className}
                          </span>
                        </div>
                        <span className="font-mono text-xs font-bold text-orange-400">
                          {percentage}%
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {breed.temperament}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-400 text-xs">
                {isStreaming ? 'Sedang memindai frame video...' : 'Kamera belum aktif.'}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}


