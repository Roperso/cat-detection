# 🐱 CatLens AI — Realtime Cat Breed Detection (YOLOv8 + ONNX Web)

> **Proyek Computer Vision & Edge AI** untuk mendeteksi dan mengklasifikasikan 14 ras kucing secara realtime langsung di browser web menggunakan **YOLOv8** dan **ONNX Runtime WebAssembly**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

---

## 🌟 Fitur Utama

- ⚡ **100% In-Browser Inference (Edge AI)**: Tanpa biaya backend server, gambar tidak dikirim ke cloud demi privasi dan kecepatan maksimal.
- 📸 **Multi-Mode Input**:
  - **Upload Foto & Drag-and-Drop**
  - **1-Click Sample Gallery** (8 sampel ras langsung coba)
  - **Live Webcam Realtime** dengan overlay bounding box dan tracking FPS/Latency.
- 🎛️ **Kontrol Interaktif**: Slider *Confidence Threshold* dan *IoU NMS Threshold* dinamis.
- 📚 **Katalog & Ensiklopedia 14 Ras Kucing**: Menampilkan informasi mendalam mengenai asal, temperamen, usia harapan hidup, dan karakteristik mantel bulu.
- 💾 **Export & Download**: Unduh gambar hasil anotasi bounding box beresolusi tinggi dengan sekali klik.

---

## 🧬 14 Ras Kucing yang Dikenali

1. **Abyssinian**
2. **Bengal**
3. **Birman**
4. **Bombay**
5. **British Shorthair**
6. **Egyptian Mau**
7. **Maine Coon**
8. **Persian (Persia)**
9. **Ragdoll**
10. **Russian Blue**
11. **Siamese (Siam)**
12. **Sphynx**
13. **Domestic (Kucing Kampung / DSH)**
14. **Mixdom (Campuran Domestik)**

---

## 🏗️ Arsitektur & Teknologi

| Komponen | Teknologi | Keterangan |
| :--- | :--- | :--- |
| **Model AI** | YOLOv8 Nano (`yolov8n`) | Dilatih dengan dataset Roboflow CatBreeds |
| **Format Model** | ONNX (Open Neural Network Exchange) | Ukuran terkompresi ~11.68 MB |
| **Runtime Engine** | `onnxruntime-web` | Akselerasi WebAssembly (WASM) & WebGL |
| **Frontend UI** | React 19 + Vite 8 | UI responsif, cepat, dan modern |
| **Styling** | Tailwind CSS v4 | Dark mode modern dengan glassmorphism |
| **Deployment** | Vercel | Serverless hosting statis global CDN |

---

## 🚀 Cara Menjalankan di Lokal (Local Development)

1. **Clone repository atau buka folder proyek**:
   ```bash
   cd cat-detection-web
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan local development server**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`.

---

## ☁️ Panduan Deploy ke Vercel (1-Click Deployment)

### Cara 1: Lewat GitHub (Paling Direkomendasikan)
1. Buat repository baru di [GitHub](https://github.com/new) (misal: `cat-detection-web`).
2. Push folder proyek ini ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial cat detection onnx web app"
   git branch -M main
   git remote add origin https://github.com/<username-kamu>/cat-detection-web.git
   git push -u origin main
   ```
3. Buka [Vercel Dashboard](https://vercel.com/dashboard) -> Klik **"Add New..."** -> **"Project"**.
4. Pilih repository `cat-detection-web` Anda.
5. Pada bagian **Framework Preset**, pilih **Vite** (otomatis terdeteksi).
6. Klik **"Deploy"**. Web app Anda akan langsung online dalam 1 menit dengan URL seperti:
   `https://cat-detection-web.vercel.app`

### Cara 2: Menggunakan Vercel CLI
```bash
npm install -g vercel
vercel
```

---

## 📄 Lisensi
MIT License. Dikembangkan untuk Portfolio & Proyek Computer Vision.
