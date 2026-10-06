import * as ort from 'onnxruntime-web';
import { CAT_CLASSES } from './catBreedsData';

// Configure ONNX Runtime WebAssembly environment for maximum browser & mobile compatibility
if (typeof window !== 'undefined') {
  ort.env.wasm.numThreads = 1;
  ort.env.wasm.simd = true;
  // Point to local origin where matching 1.30.0 WASM and MJS binaries are served
  ort.env.wasm.wasmPaths = window.location.origin + '/';
}

let session = null;
let isModelLoading = false;

/**
 * Load the ONNX model session
 */
export async function loadModel(onProgress) {
  if (session) return session;
  if (isModelLoading) {
    let attempts = 0;
    while (isModelLoading && attempts < 100) {
      await new Promise((r) => setTimeout(r, 100));
      attempts++;
    }
    if (session) return session;
  }

  isModelLoading = true;
  if (onProgress) onProgress('Mengunduh model ONNX (11.7 MB)...');

  try {
    // 1. Fetch model binary explicitly
    const response = await fetch('/models/best.onnx');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: Gagal mengunduh file /models/best.onnx`);
    }
    const modelBuffer = await response.arrayBuffer();

    if (onProgress) onProgress('Membuat session ONNX WASM...');

    // 2. Multi-tier session initialization
    try {
      session = await ort.InferenceSession.create(modelBuffer, {
        executionProviders: ['wasm'],
        graphOptimizationLevel: 'all'
      });
      console.log('ONNX Model Loaded Successfully (WASM ArrayBuffer):', session);
    } catch (wasmErr) {
      console.warn('WASM execution provider failed, retrying default session creation:', wasmErr);
      try {
        session = await ort.InferenceSession.create(modelBuffer);
        console.log('ONNX Model Loaded Successfully (Default Fallback):', session);
      } catch (bufErr) {
        console.warn('Buffer creation failed, trying direct URL:', bufErr);
        session = await ort.InferenceSession.create('/models/best.onnx');
        console.log('ONNX Model Loaded Successfully (Path Fallback):', session);
      }
    }

    if (onProgress) onProgress('Model siap digunakan!');
    return session;
  } catch (err) {
    console.error('Fatal ONNX model load failure:', err);
    if (onProgress) onProgress('Gagal memuat model AI.');
    throw err;
  } finally {
    isModelLoading = false;
  }
}

/**
 * Preprocess image with letterbox resize to 640x640
 */
function preprocessImage(imageSource, inputWidth = 640, inputHeight = 640) {
  const origWidth = imageSource.naturalWidth || imageSource.videoWidth || imageSource.width || 640;
  const origHeight = imageSource.naturalHeight || imageSource.videoHeight || imageSource.height || 640;

  if (origWidth === 0 || origHeight === 0) {
    throw new Error('Image source dimensions are 0');
  }

  // Calculate letterbox scaling
  const scale = Math.min(inputWidth / origWidth, inputHeight / origHeight);
  const newWidth = Math.round(origWidth * scale);
  const newHeight = Math.round(origHeight * scale);
  const padX = (inputWidth - newWidth) / 2;
  const padY = (inputHeight - newHeight) / 2;

  // Draw to offscreen canvas
  const canvas = document.createElement('canvas');
  canvas.width = inputWidth;
  canvas.height = inputHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  // Fill with standard YOLO letterbox background (114, 114, 114)
  ctx.fillStyle = '#727272';
  ctx.fillRect(0, 0, inputWidth, inputHeight);

  // Draw image centered
  ctx.drawImage(imageSource, padX, padY, newWidth, newHeight);

  const imageData = ctx.getImageData(0, 0, inputWidth, inputHeight);
  const data = imageData.data;

  // Convert RGBA HWC to RGB CHW Float32Array normalized to [0, 1]
  const float32Data = new Float32Array(3 * inputWidth * inputHeight);
  const totalPixels = inputWidth * inputHeight;

  for (let i = 0; i < totalPixels; i++) {
    const r = data[i * 4] / 255.0;
    const g = data[i * 4 + 1] / 255.0;
    const b = data[i * 4 + 2] / 255.0;

    float32Data[i] = r;                          // Channel R
    float32Data[totalPixels + i] = g;            // Channel G
    float32Data[totalPixels * 2 + i] = b;        // Channel B
  }

  const tensor = new ort.Tensor('float32', float32Data, [1, 3, inputHeight, inputWidth]);

  return {
    tensor,
    scale,
    padX,
    padY,
    origWidth,
    origHeight,
    canvas
  };
}

/**
 * Calculate Intersection over Union (IoU)
 */
function calculateIoU(box1, box2) {
  const x1 = Math.max(box1.x, box2.x);
  const y1 = Math.max(box1.y, box2.y);
  const x2 = Math.min(box1.x + box1.width, box2.x + box2.width);
  const y2 = Math.min(box1.y + box1.height, box2.y + box2.height);

  const intersection = Math.max(0, x2 - x1) * Math.max(0, y2 - y1);
  const area1 = box1.width * box1.height;
  const area2 = box2.width * box2.height;
  const union = area1 + area2 - intersection;

  return union <= 0 ? 0 : intersection / union;
}

/**
 * Non-Maximum Suppression (NMS)
 */
function nonMaxSuppression(boxes, iouThreshold = 0.45) {
  boxes.sort((a, b) => b.score - a.score);

  const selectedBoxes = [];
  const active = new Array(boxes.length).fill(true);

  for (let i = 0; i < boxes.length; i++) {
    if (!active[i]) continue;

    selectedBoxes.push(boxes[i]);

    for (let j = i + 1; j < boxes.length; j++) {
      if (!active[j]) continue;

      const iou = calculateIoU(boxes[i], boxes[j]);
      if (iou > iouThreshold) {
        active[j] = false;
      }
    }
  }

  return selectedBoxes;
}

/**
 * Run inference on an image / video frame
 */
export async function detectObjects(imageSource, confThreshold = 0.25, iouThreshold = 0.45) {
  const modelSession = await loadModel();
  if (!modelSession) throw new Error('Failed to obtain ONNX InferenceSession');

  const startTime = performance.now();

  const { tensor, scale, padX, padY, origWidth, origHeight } = preprocessImage(imageSource, 640, 640);

  // Dynamic input name lookup
  const inputName = modelSession.inputNames[0];
  const feeds = { [inputName]: tensor };

  const results = await modelSession.run(feeds);
  const outputName = modelSession.outputNames[0];
  const outputTensor = results[outputName];

  // Output shape: [1, 18, 8400]
  const [batch, channels, numBoxes] = outputTensor.dims;
  const data = outputTensor.data;

  const numClasses = channels - 4; // 14
  const candidateBoxes = [];

  for (let i = 0; i < numBoxes; i++) {
    // Find best class
    let maxScore = 0;
    let bestClassId = -1;

    for (let c = 0; c < numClasses; c++) {
      const classScore = data[(4 + c) * numBoxes + i];
      if (classScore > maxScore) {
        maxScore = classScore;
        bestClassId = c;
      }
    }

    if (maxScore >= confThreshold && bestClassId >= 0) {
      const cx = data[0 * numBoxes + i];
      const cy = data[1 * numBoxes + i];
      const w = data[2 * numBoxes + i];
      const h = data[3 * numBoxes + i];

      // Convert from letterbox 640x640 back to original image coordinates
      let x1 = (cx - w / 2 - padX) / scale;
      let y1 = (cy - h / 2 - padY) / scale;
      let width = w / scale;
      let height = h / scale;

      // Clamp to original dimensions
      x1 = Math.max(0, Math.min(origWidth, x1));
      y1 = Math.max(0, Math.min(origHeight, y1));
      width = Math.min(origWidth - x1, width);
      height = Math.min(origHeight - y1, height);

      if (width > 5 && height > 5) {
        candidateBoxes.push({
          x: x1,
          y: y1,
          width,
          height,
          score: maxScore,
          classId: bestClassId,
          className: CAT_CLASSES[bestClassId] || `Class_${bestClassId}`
        });
      }
    }
  }

  // Apply NMS
  const finalDetections = nonMaxSuppression(candidateBoxes, iouThreshold);
  const inferenceTime = performance.now() - startTime;

  return {
    detections: finalDetections,
    inferenceTime: Math.round(inferenceTime),
    origWidth,
    origHeight
  };
}

