# 🐾 CatLens AI — Realtime Cat Breed Detection (YOLOv8 + ONNX Web)

> **Proyek Computer Vision & Edge AI** untuk mendeteksi dan mengklasifikasikan 14 ras kucing secara realtime langsung di browser web menggunakan **YOLOv8** dan **ONNX Runtime WebAssembly**.

---

## 🌟 Fitur Utama

- ⚡ **100% In-Browser Inference (Edge AI)**: Komputasi AI berjalan langsung di browser klien. Gambar tidak dikirim ke server backend demi privasi 100% aman dan respon tanpa delay.
- 📸 **Multi-Mode Input**:
  - **Upload Foto & Drag-and-Drop** (Format JPG, PNG, WEBP).
  - **1-Click Sample Gallery** (8 sampel foto ras kucing siap diuji).
  - **Live Kamera Realtime** dengan pemindaian terus-menerus, penandaan bounding box, serta statistik FPS & Latency (ms).
- 🎛️ **Kontrol Sensitivitas Interaktif**: Slider *Confidence Threshold* dan *IoU NMS Threshold* dinamis.
- 📚 **Katalog & Ensiklopedia 14 Ras Kucing**: Informasi lengkap mengenai asal-usul, sifat/temperamen, harapan hidup, dan karakteristik bulu.
- 💾 **Export & Unduh Hasil**: Simpan gambar hasil anotasi bounding box beresolusi tinggi hanya dengan 1 klik.
- 📱 **Desain UI Responsif**: Tampilan modern, bersih, intuitif, dan nyaman dibuka baik di Desktop, Tablet, maupun HP.

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
| **Model AI** | YOLOv8 Nano (`yolov8n`) | Model deteksi objek ringan yang telah ditrain pada dataset ras kucing |
| **Format Model** | ONNX (Open Neural Network Exchange) | Format standar terbuka (~11.68 MB) |
| **Runtime Engine** | `onnxruntime-web` | Akselerasi WebAssembly (WASM) & WebGL |
| **Frontend Framework** | React 19 + Vite 8 | Interface responsif, cepat, dan terstruktur |
| **Styling** | Tailwind CSS v4 | Tema dark slate yang bersih, readable, dan elegan |
| **Icons** | Lucide React | Ikon UI yang konsisten dan informatif |
| **Deployment** | Vercel | Hosting serverless global CDN |

---

## 🚀 Cara Menjalankan di Lokal (Local Development)

1. **Clone repository**:
   ```bash
   git clone https://github.com/Roperso/cat-detection.git
   cd cat-detection
   ```

2. **Install dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan server pengembangan lokal**:
   ```bash
   npm run dev
   ```
   Buka browser di `http://localhost:5173`.

4. **Build untuk produksi**:
   ```bash
   npm run build
   ```

---

## ☁️ Deploy ke Vercel

Proyek ini siap di-deploy ke **Vercel** secara gratis:
1. Hubungkan akun Vercel Anda dengan GitHub.
2. Import repositori `Roperso/cat-detection`.
3. Vercel akan mendeteksi **Vite** secara otomatis.
4. Klik **Deploy**.

---

## 📄 Lisensi

MIT License. Dikembangkan untuk Portofolio & Proyek Computer Vision.
