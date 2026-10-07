# SIGAP-ASET / SIAP DISHUB DIY
> **Sistem Informasi Geospasial dan Pengelolaan Aset Dinas Perhubungan Daerah Istimewa Yogyakarta**

[![Vue 3](https://img.shields.io/badge/Frontend-Vue%203%20%2B%20Vite-42b883?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%2014%2B-4169e1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Leaflet GIS](https://img.shields.io/badge/GIS-Leaflet%20Mapping-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)
[![Security](https://img.shields.io/badge/Auth-JWT%20%2B%20RBAC-f59e0b?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

---

## 📌 1. Latar Belakang & Deskripsi Sistem

Dinas Perhubungan Daerah Istimewa Yogyakarta mengelola ribuan aset Barang Milik Daerah (BMD) fasilitas perhubungan dan keselamatan lalu lintas jalan yang tersebar di seluruh wilayah kota dan kabupaten di DIY (Kota Yogyakarta, Sleman, Bantul, Kulon Progo, dan Gunungkidul). Aset tersebut mencakup:
* **Fasilitas Keselamatan Jalan**: APILL (Alat Pemberi Isyarat Lalu Lintas), rambu lalu lintas, marka jalan, guardrail/pagar pengaman, cermin tikungan, dan penerangan jalan umum (PJU).
* **Fasilitas Operasional & Perlengkapan**: Kendaraan dinas operasional perhubungan, halte/shelter bus Trans Jogja, pos pengawasan, dan alat uji berkala kendaraan bermotor (KIR).

**SIGAP-ASET** hadir sebagai solusi berbasis web terpadu untuk mendigitalkan seluruh siklus pengelolaan aset BMD, mengintegrasikan data fisik dengan **koordinat geospasial (GIS)**, mengotomasi jadwal **pemeliharaan/uji berkala**, menerapkan **perlindungan audit trail (soft delete)**, serta sinkronisasi awan dua arah (*cloud sync*) dengan Google Sheets API.

---

## ✨ 2. Fitur Utama

1. **Pemetaan Geospasial Interaktif (Leaflet GIS)**
   * Visualisasi pin marker aset pada peta OpenStreetMap DIY dengan pop-up detail kondisi dan foto fisik.
   * Penentuan titik fisik aset (*pinpoint*) otomatis mengisi koordinat *latitude* & *longitude* secara presisi.
   * Fitur filter radius pencarian di sekitar lokasi pengguna.

2. **Penatausahaan 29+ Atribut BMD (Standar Regulasi)**
   * Memenuhi standar pencatatan **Permendagri No. 19/2016** & **PP No. 28/2020**.
   * Mencatat yuridis lengkap: Nomor & Tanggal BAST, Nomor & Tanggal Kontrak/SPK, Asal Usul (APBD/APBN/Hibah), Nilai Perolehan, Nomor Rangka, Nomor Mesin, BPKB, Nomor Polisi, Warna, Merk/Tipe, Bahan, dan Pengguna.

3. **Manajemen Siklus Pemeliharaan (Maintenance Lifecycle)**
   * Kalender interaktif untuk menyusun jadwal servis rutin, perbaikan kerusakan fasilitas lalu lintas, dan agenda uji KIR berkala.
   * Penugasan staf teknis (*PIC*) dan pembaruan status pemeliharaan real-time.

4. **Keamanan & Kontrol Akses Berjenjang (RBAC & JWT)**
   * **Super Admin**: Hak akses penuh termasuk manajemen akun staf, otorisasi penghapusan (*Soft Delete*), pemulihan (*Restore*), dan penghapusan permanen.
   * **User (Petugas Lapangan)**: Penginputan aset baru, pembaruan data, penjadwalan pemeliharaan, dan ekspor dokumen.
   * **Publik**: Akses tanpa login untuk melihat transparansi sebaran peta aset dan statistik ringkas fasilitas publik.

5. **Mekanisme Perlindungan Data & Audit Trail (Soft Delete)**
   * Penghapusan aset tidak langsung menghapus baris database fisik, melainkan menandai flag `is_deleted = true`.
   * Data masuk ke modul *Deleted Log* dan dapat dipulihkan (*Restore*) sewaktu-waktu oleh Super Admin.

6. **Interoperabilitas & Sinkronisasi Cloud Dua Arah**
   * Ekspor data ke format CSV dengan pengkodean **UTF-8 BOM** (bebas galat karakter saat dibuka di Microsoft Excel).
   * Sinkronisasi otomatis dua arah ke Google Spreadsheet via **Google Cloud Service Account API v4**.

---

## 📐 3. Diagram Rekayasa Perangkat Lunak & Dokumentasi

Dokumentasi diagram sistem telah dirancang dengan format standar akademis/skripsi:

| Jenis Diagram | Dokumen & Gambar | Format / Notasi |
| :--- | :--- | :--- |
| **Viewer Interaktif** | [analisis_diagram_sigap.html](file:///d:/WEB/SIGAP-Aset/analisis_diagram_sigap.html) | Dashboard interaktif (Zoom, Download SVG, Cetak PDF, Kamus Data) |
| **Use Case Diagram** | [usecase_diagram_sigap.svg](file:///d:/WEB/SIGAP-Aset/usecase_diagram_sigap.svg) | Standar UML 2.5 (`3.2.1. Usecase Diagram`), 2 Aktor, Generalization `<\|--`, dan `<<include>>` ke Login |
| **Activity Diagram** | [activity_diagram_sigap.svg](file:///d:/WEB/SIGAP-Aset/activity_diagram_sigap.svg) | Standar Swimlane 3 Kolom (`Gambar 3. 10`): Admin \| Sistem \| User (Petugas) |
| **Entity Relationship (ERD)** | [erd_diagram_sigap.svg](file:///d:/WEB/SIGAP-Aset/erd_diagram_sigap.svg) | Format Workbench/pgAdmin (`Gambar 3. 11`), Notasi Crow's Foot, Tipe PostgreSQL |
| **Spesifikasi Kebutuhan (SRS)** | [DOKUMEN_ANALISIS_KEBUTUHAN_SISTEM.md](file:///d:/WEB/SIGAP-Aset/DOKUMEN_ANALISIS_KEBUTUHAN_SISTEM.md) | Dokumen SRS lengkap 18 Use Case & 32 Atribut Barang |
| **SOP Pengelolaan Sistem** | [SOP_PENGELOLAAN_SIAP.md](file:///d:/WEB/SIGAP-Aset/SOP_PENGELOLAAN_SIAP.md) | Prosedur Operasional Standar Pengelolaan dan Pemeliharaan Aset |

---

## 🛠 4. Arsitektur & Teknologi

* **Frontend**:
  * **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup>`)
  * **Build Tool**: [Vite](https://vitejs.dev/)
  * **State Management**: [Pinia](https://pinia.vuejs.org/)
  * **Routing**: [Vue Router 4](https://router.vuejs.org/)
  * **Pemetaan GIS**: [Leaflet JS](https://leafletjs.com/)
  * **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
  * **Pengolah Spreadsheet**: ExcelJS & SheetJS (XLSX)

* **Backend**:
  * **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
  * **Web Framework**: [Express.js](https://expressjs.com/)
  * **Autentikasi**: JSON Web Token (JWT) & bcryptjs
  * **Database Client**: `pg` (node-postgres Connection Pool)
  * **Integrasi Cloud**: `googleapis` (Google Sheets API v4)

* **Database Engine**:
  * **DBMS Utama**: [PostgreSQL 14+](https://www.postgresql.org/)
  * **Ketahanan Sistem**: Hybrid fallback engine (`backend/data/store.js`) jika koneksi DBMS eksternal terputus.

---

## 📂 5. Struktur Direktori Repositori

```text
SIGAP-Aset/
├── backend/                             # Layanan REST API Backend (Express.js)
│   ├── data/                            # Cadangan skema lokal & store fallback
│   │   ├── store.js                     # In-memory store fallback engine
│   │   └── store.json                   # State penyimpanan lokal runtime
│   ├── src/
│   │   ├── controllers/                 # Logika bisnis (Aset, Auth, Maintenance)
│   │   ├── db/                          # Konfigurasi PostgreSQL pool & migrasi DDL
│   │   ├── middleware/                  # Verifikasi JWT & proteksi role (RBAC)
│   │   ├── routes/                      # Definisi endpoint REST API
│   │   ├── services/                    # Integrasi Google Sheets API v4
│   │   └── index.js                     # Entry point server backend
│   ├── .env.example                     # [TEMPLATE] Contoh konfigurasi environment
│   ├── service-account.example.json     # [TEMPLATE] Contoh kredensial Google Service Account
│   ├── package.json                     # Dependensi backend
│   └── package-lock.json
│
├── frontend/                            # Aplikasi Antarmuka Pengguna (Vue 3 + Vite)
│   ├── public/                          # Aset statis (ikon, favicon, marker GIS)
│   ├── src/
│   │   ├── assets/                      # Stylesheet global & ikon
│   │   ├── components/                  # Komponen UI (Modal, Navbar, Peta, Tabel)
│   │   ├── router/                      # Definisi rute halaman & Route Guards
│   │   ├── stores/                      # Pinia store (Auth, Asset, Maintenance)
│   │   ├── views/                       # Tampilan halaman utama
│   │   ├── App.vue                      # Root Vue Component
│   │   └── main.js                      # Entry point frontend
│   ├── index.html                       # Single Page Application HTML
│   ├── vite.config.js                   # Konfigurasi Vite bundler
│   └── package.json                     # Dependensi frontend
│
├── .gitignore                           # Proteksi berkas sensitif, cache, & output build
├── README.md                            # Dokumentasi utama proyek
├── analisis_diagram_sigap.html          # Viewer dokumen diagram interaktif (ERD, Use Case, Activity)
├── usecase_diagram_sigap.svg            # Berkas vektor Use Case Diagram (Standar Akademis 3.2.1)
├── activity_diagram_sigap.svg           # Berkas vektor Swimlane Activity Diagram (Gambar 3.10)
├── erd_diagram_sigap.svg                # Berkas vektor Entity Relationship Diagram (Gambar 3.11)
├── DOKUMEN_ANALISIS_KEBUTUHAN_SISTEM.md # Dokumen Spesifikasi Kebutuhan Sistem (SRS)
└── SOP_PENGELOLAAN_SIAP.md              # Standar Operasional Prosedur Pengelolaan SIAP
```

---

## 🚀 6. Panduan Instalasi & Menjalankan Sistem

### A. Prasyarat Sistem
* [Node.js](https://nodejs.org/) versi `18.x` atau lebih baru
* [PostgreSQL](https://www.postgresql.org/) versi `14.x` atau lebih baru
* [Git](https://git-scm.com/)

---

### B. Konfigurasi & Menjalankan Backend

1. **Masuk ke direktori backend**:
   ```bash
   cd backend
   ```

2. **Pasang seluruh dependensi**:
   ```bash
   npm install
   ```

3. **Buat basis data di PostgreSQL**:
   ```sql
   CREATE DATABASE siap;
   ```

4. **Konfigurasikan Berkas Environment (`.env`)**:
   Salin berkas template `.env.example` menjadi `.env`:
   ```bash
   cp .env.example .env
   ```
   Buka file `.env` dan sesuaikan nilainya:
   ```env
   PORT=5000
   PGHOST=localhost
   PGPORT=5432
   PGDATABASE=siap
   PGUSER=postgres
   PGPASSWORD=password_postgres_anda
   JWT_SECRET=rahasia_jwt_super_aman_minimal_32_karakter
   GOOGLE_SHEET_ID=id_spreadsheet_google_anda
   ```

5. **Konfigurasikan Google Cloud Service Account (Opsional untuk Sinkronisasi Sheets)**:
   * Buat Service Account di Google Cloud Console, unduh file kunci JSON, lalu simpan sebagai `backend/service-account.json`.
   * Template struktur kunci dapat dilihat pada [backend/service-account.example.json](file:///d:/WEB/SIGAP-Aset/backend/service-account.example.json).

6. **Jalankan Server Backend**:
   ```bash
   # Mode pengembangan (dengan live auto-reload):
   npm run dev

   # Atau mode produksi:
   npm start
   ```
   *Server backend akan aktif di `http://localhost:5000`*.

---

### C. Konfigurasi & Menjalankan Frontend

1. **Buka terminal baru dan masuk ke direktori frontend**:
   ```bash
   cd frontend
   ```

2. **Pasang dependensi**:
   ```bash
   npm install
   ```

3. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   *Aplikasi frontend dapat diakses melalui browser di `http://localhost:5173`*.

---

## 🔒 7. Kebijakan Keamanan & File Sensitif

Demi menjaga integritas sistem informasi milik pemerintah daerah dan menghindari kebocoran data, berkas-berkas berikut **TELAH DIISOLASI PADA `.gitignore` DAN DILARANG KERAS DI-COMMIT KE GIT**:

1. **`backend/.env` & `frontend/.env`**:
   * Berisi kredensial langsung ke database produksi/lokal, kunci privat tanda tangan token JWT, dan ID resource internal.
   * Gunakan selalu berkas template [backend/.env.example](file:///d:/WEB/SIGAP-Aset/backend/.env.example) sebagai acuan.
2. **`backend/service-account.json`**:
   * Berisi *private key* RSA Google Cloud Platform dengan izin baca-tulis ke Google Sheets.
   * Gunakan template [backend/service-account.example.json](file:///d:/WEB/SIGAP-Aset/backend/service-account.example.json) sebagai acuan.
3. **Folder `scratch/` & File Uji Ad-hoc**:
   * Folder ini hanya digunakan untuk skrip eksperimen sementara, berkas gambar verifikasi visual (*screenshot*), dan dump sementara yang tidak dibutuhkan dalam operasional produksi sistem.
4. **Berkas Dokumen Laporan & Diagram Skripsi**:
   * Dokumen analisis kebutuhan (*SRS*), dokumen SOP, berkas Word/PDF, serta diagram vektor (*SVG*) tidak disertakan di dalam *repository* Git (diabaikan via `.gitignore`) untuk menjaga ukuran repositori tetap ringan dan berfokus murni pada kode sumber aplikasi (*source code*). Berkas-berkas tersebut tetap tersimpan di direktori lokal untuk keperluan administrasi dan pencetakan dokumen.

---

## 👥 8. Akun Uji Coba Default (Development Seed)

| Role | Username | Password Default | Hak Akses Utama |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin` | `admin123` *(atau sesuaikan DB)* | Akses penuh, Soft Delete, Restore, Manajemen Pengguna |
| **Petugas Lapangan** | `petugas` | `petugas123` | Input aset 29+ atribut, pinpoint GPS, ajukan servis/KIR |
| **Masyarakat / Peninjau** | *(Tanpa Login)* | *(Tanpa Login)* | Peta sebaran publik & statistik ringkas BMD |

---

## 📄 9. Lisensi & Hak Cipta

Hak Cipta &copy; 2026 **Dinas Perhubungan Daerah Istimewa Yogyakarta**.  
Seluruh hak cipta dilindungi undang-undang. Sistem ini dikembangkan untuk keperluan kedinasan penatausahaan Barang Milik Daerah (BMD) di lingkungan Pemerintah Daerah D.I. Yogyakarta.
