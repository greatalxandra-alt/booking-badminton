# PRD: Website Booking Lapangan Badminton + Dashboard Admin

**Versi:** 1.0 — MVP  
**Target:** Pemilik lapangan lokal yang masih terima booking via WA/telepon  
**Tech Stack:** Next.js 14+ (App Router) · Tailwind CSS · Supabase · Vercel

---

## 1. BREAKDOWN FITUR: MVP vs Nice-to-Have

### ✅ MVP (Wajib Launch)

| Modul                   | Fitur                                                                | Keterangan                                          |
| ----------------------- | -------------------------------------------------------------------- | --------------------------------------------------- |
| **User - Lapangan**     | Lihat daftar lapangan (card: foto, nama, harga/jam, status tersedia) | Grid/list view, mobile-first                        |
| **User - Booking**      | Pilih tanggal → sistem tampilkan slot jam kosong (per jam)           | Hindari bentrok via query Supabase                  |
| **User - Booking**      | Form data diri: nama, no HP, catatan (opsional)                      | Validasi client + server                            |
| **User - Booking**      | Konfirmasi → booking tersimpan status "Pending"                      | Tampilkan halaman sukses + ringkasan                |
| **User - Pembayaran**   | Halaman instruksi pembayaran manual (rekening bank + QRIS statis)    | Admin yang upload nomor rekening & QRIS             |
| **User - Pembayaran**   | Upload bukti transfer (foto/screenshot)                              | Supabase Storage, max 2MB, format JPG/PNG/WebP      |
| **User - Pembayaran**   | Alternatif: tombol "Konfirmasi via WhatsApp" (deep link ke WA admin) | `https://wa.me/62xxx?text=...`                      |
| **Admin - Auth**        | Login pakai email + password                                         | Supabase Auth, middleware proteksi route `/admin/*` |
| **Admin - Dashboard**   | Lihat semua booking: tabel dengan filter lapangan, tanggal, status   | Sort by created_at DESC                             |
| **Admin - Detail**      | Klik booking → modal/drawer: data pemesan + bukti bayar (lightbox)   | Tanpa pindah halaman                                |
| **Admin - Status**      | Ubah status: Pending → Lunas / Batal                                 | Dropdown inline + konfirmasi                        |
| **Admin - Operasional** | Atur jam buka/tutup & harga per lapangan                             | Form edit simple, 1 lapangan = 1 record             |
| **Admin - Rekening**    | Atur nomor rekening & upload QRIS untuk halaman instruksi bayar      | Disimpan di tabel `pengaturan`                      |

### 🔮 Nice-to-Have (Future Improvement)

- ⬜ Kalender visual (heatmap slot kosong/terisi)
- ⬜ Notifikasi WA otomatis saat status berubah (via WhatsApp Business API / Twilio)
- ⬜ Recurring booking (booking mingguan rutin)
- ⬜ Multi-admin / role-based access
- ⬜ Export laporan ke Excel/PDF
- ⬜ Riwayat booking per pelanggan (cocokkan no HP)
- ⬜ Phone OTP login untuk user
- ⬜ QR code check-in di lokasi
- ⬜ Dark mode
- ⬜ Halaman public booking status cek (by booking ID)

---

## 2. USER FLOW & ADMIN FLOW

### 🔵 USER FLOW (Penyewa)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Landing Page (/)
│    ├─ Hero: "Booking Lapangan Badminton Mudah, Tanpa Ribet"
│    └─ Grid Lapangan (card: foto, nama, harga/jam)
│
│ 2. Klik "Pesan Sekarang" pada salah satu lapangan
│    └─ Redirect: /lapangan/[id]
│
│ 3. Halaman Detail Lapangan + Pilih Tanggal
│    ├─ Info lapangan: foto besar, deskripsi, harga/jam
│    ├─ Date picker (tanggal hari ini s/d +30 hari)
│    └─ Setelah pilih tanggal → fetch slot kosong
│
│ 4. Pilih Slot Jam (tampilan grid tombol jam)
│    ├─ Jam tersedia: hijau | Dipilih: biru | Terbooking: abu-abu (disabled)
│    ├─ User bisa pilih 1 slot (1 jam) atau lebih (kontinu)
│    ├─ Indicator: "08:00 - 09:00" & total harga
│    └─ Tombol "Lanjutkan"
│
│ 5. Form Data Diri
│    ├─ Nama pemesan (required)
│    ├─ No HP/WA (required) — format 08xxx
│    ├─ Catatan (opsional, max 200 char)
│    └─ Tombol "Konfirmasi Booking"
│
│ 6. Konfirmasi → Insert ke DB → status "Pending"
│    └─ Redirect: /booking/[id]/sukses
│
│ 7. Halaman Sukses + Instruksi Pembayaran
│    ├─ Ringkasan booking (lapangan, tanggal, jam, harga)
│    ├─ Status: Pending (badge kuning)
│    ├─ Info rekening bank (dari tabel pengaturan)
│    ├─ Gambar QRIS (dari Supabase Storage)
│    ├─ Upload bukti transfer (drag & drop / klik)
│    ├─ Atau tombol "Konfirmasi via WhatsApp Admin"
│    └─ Pesan: "Admin akan verifikasi pembayaran Anda"
│
│ 8. (Opsional) Cek status booking via /cek-booking
│    └─ Input booking ID → lihat status terkini
└─────────────────────────────────────────────────────────┘
```

### 🟠 ADMIN FLOW (Pemilik Lapangan)

```
┌─────────────────────────────────────────────────────────┐
│ 1. Login
│    └─ /admin/login → email + password → Supabase Auth
│
│ 2. Dashboard Utama (/admin)
│    ├─ Statistik ringkas: total booking hari ini, pending, lunas
│    ├─ Tabel booking terbaru (5-10 teratas)
│    └─ Link ke kelola lapangan & pengaturan
│
│ 3. Kelola Booking (/admin/booking)
│    ├─ Filter: dropdown lapangan, date range, dropdown status
│    ├─ Tabel: id, lapangan, tanggal, jam, pemesan, no HP, status, bukti
│    ├─ Klik baris → modal/drawer detail
│    │   ├─ Data lengkap pemesan
│    │   ├─ Bukti bayar (klik = lightbox fullscreen)
│    │   ├─ Dropdown ubah status: Pending → Lunas / Batal
│    │   └─ Tombol WA langsung ke pemesan
│    └─ Badge status: Pending (kuning), Lunas (hijau), Batal (merah)
│
│ 4. Kelola Lapangan (/admin/lapangan)
│    ├─ Tabel/list lapangan yang sudah ada
│    ├─ Tombol tambah/edit
│    ├─ Form: nama, deskripsi, harga/jam, jam buka, jam tutup, upload foto, status aktif
│    └─ Hapus = soft-delete (status_aktif = false)
│
│ 5. Pengaturan (/admin/pengaturan)
│    ├─ Nama rekening + nomor rekening (bisa >1 bank)
│    ├─ Upload gambar QRIS
│    ├─ Nomor WA admin (untuk deep link)
│    └─ Jam operasional default
│
│ 6. Logout
└─────────────────────────────────────────────────────────┘
```

---

## 3. SKEMA DATABASE FINAL (Supabase Postgres)

### Tabel: `lapangan`

| Kolom           | Tipe          | Constraint                      | Keterangan                                 |
| --------------- | ------------- | ------------------------------- | ------------------------------------------ |
| `id`            | `uuid`        | PK, default `gen_random_uuid()` | Primary key                                |
| `nama`          | `text`        | NOT NULL                        | "Lapangan A", "Lapangan VIP"               |
| `deskripsi`     | `text`        | NULL                            | Deskripsi lapangan (lantai, lighting, dll) |
| `harga_per_jam` | `integer`     | NOT NULL, >0                    | Harga dalam Rupiah                         |
| `jam_buka`      | `time`        | NOT NULL                        | Contoh: `06:00`                            |
| `jam_tutup`     | `time`        | NOT NULL                        | Contoh: `22:00`                            |
| `foto_url`      | `text`        | NULL                            | URL dari Supabase Storage                  |
| `status_aktif`  | `boolean`     | DEFAULT `true`                  | Soft delete / disable lapangan             |
| `created_at`    | `timestamptz` | DEFAULT `now()`                 |                                            |

### Tabel: `booking`

| Kolom                  | Tipe          | Constraint                      | Keterangan                                     |
| ---------------------- | ------------- | ------------------------------- | ---------------------------------------------- |
| `id`                   | `uuid`        | PK, default `gen_random_uuid()` | Juga jadi "Booking ID" untuk user              |
| `lapangan_id`          | `uuid`        | FK → `lapangan.id`, NOT NULL    |                                                |
| `tanggal_main`         | `date`        | NOT NULL                        | Format `YYYY-MM-DD`                            |
| `jam_mulai`            | `time`        | NOT NULL                        | Contoh: `08:00`                                |
| `jam_selesai`          | `time`        | NOT NULL                        | Contoh: `09:00` (min 1 jam setelah jam_mulai)  |
| `nama_pemesan`         | `text`        | NOT NULL                        |                                                |
| `no_hp`                | `text`        | NOT NULL                        | Format `628xxxx`                               |
| `catatan`              | `text`        | NULL                            | Maks 200 karakter (validasi app)               |
| `bukti_pembayaran_url` | `text`        | NULL                            | URL dari Supabase Storage bucket `bukti-bayar` |
| `status`               | `text`        | NOT NULL, DEFAULT `'pending'`   | ENUM: `pending`, `lunas`, `batal`              |
| `created_at`           | `timestamptz` | DEFAULT `now()`                 |                                                |

**Index tambahan:**

- `idx_booking_lapangan_tanggal` on `(lapangan_id, tanggal_main)` — untuk query cek slot kosong
- `idx_booking_status` on `(status)` — untuk filter dashboard
- `idx_booking_tanggal` on `(tanggal_main)` — untuk filter per tanggal

**Unique constraint (opsional tapi direkomendasikan):** Tidak diterapkan, karena bisa saja 1 user booking 2 slot terpisah di lapangan & tanggal yang sama (atau admin override). Validasi bentrok dilakukan di application layer (Supabase RLS atau server-side check).

### Tabel: `pengaturan` (Key-Value Store)

| Kolom        | Tipe          | Constraint      | Keterangan                                          |
| ------------ | ------------- | --------------- | --------------------------------------------------- |
| `key`        | `text`        | PK              | Contoh: `no_rekening`, `nomor_wa_admin`, `qris_url` |
| `value`      | `text`        | NOT NULL        | Nilai setting                                       |
| `updated_at` | `timestamptz` | DEFAULT `now()` |                                                     |

Sample data:

```
key: 'nama_bank'         → 'BCA'
key: 'no_rekening'       → '1234567890'
key: 'atas_nama_rekening' → 'John Doe'
key: 'qris_url'          → 'https://xxx.supabase.co/storage/v1/...'
key: 'nomor_wa_admin'    → '6281234567890'
```

### Supabase Storage Buckets

| Bucket        | Access                                 | Isi                 |
| ------------- | -------------------------------------- | ------------------- |
| `lapangan`    | Public read                            | Foto lapangan       |
| `bukti-bayar` | Private (RLS: user upload, admin read) | Bukti transfer user |

### Row Level Security (RLS)

- **`lapangan`**: SELECT untuk semua (public), INSERT/UPDATE/DELETE hanya untuk authenticated (admin)
- **`booking`**: INSERT untuk public (anon), SELECT public bisa cek status by ID sendiri; SELECT all + UPDATE status untuk authenticated admin
- **`pengaturan`**: SELECT public (untuk halaman instruksi bayar), INSERT/UPDATE/DELETE authenticated admin
- **Storage `bukti-bayar`**: INSERT untuk anon (upload bukti), SELECT untuk authenticated

---

## 4. TASK LIST — Siap Pakai untuk AI Coding Agent

Task ini disusun berurutan (dependencies). Setiap task dirancang mandiri, output-nya satu file atau satu fitur yang bisa di-review.

### PHASE 0: Project Setup

| #   | Task                                       | Detail                                                                                                | File/Folder                                |
| --- | ------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------ |
| 0.1 | Inisialisasi Next.js App Router + Tailwind | `npx create-next-app@latest` → TypeScript, Tailwind, App Router, src/                                 | Root project                               |
| 0.2 | Setup Supabase client                      | Install `@supabase/supabase-js`, buat `lib/supabase.ts` (server & client client), setup `.env.local`  | `src/lib/supabase.ts`                      |
| 0.3 | Setup layout global                        | Layout root: font Inter, metadata SEO, `<Toaster>` (sonner), Tailwind config extended (warna brand)   | `src/app/layout.tsx`, `tailwind.config.ts` |
| 0.4 | Buat skema database                        | SQL migration: buat 3 tabel + index + RLS + 2 storage bucket. Simpan di folder `supabase/migrations/` | `supabase/migrations/0000_init.sql`        |

### PHASE 1: Backend / API Layer

| #   | Task                                     | Detail                                                                                                                                                                   | File/Folder                                        |
| --- | ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------- |
| 1.1 | API: GET lapangan aktif                  | Server action atau route handler — ambil semua lapangan dg status_aktif=true                                                                                             | `src/app/api/lapangan/route.ts` atau server action |
| 1.2 | API: GET slot kosong                     | Input: `lapangan_id`, `tanggal`. Logic: generate array jam berdasarkan jam_buka-tutup, exclude jam yang sudah di-booking (status != 'batal'), return array slot tersedia | `src/lib/slot-engine.ts`                           |
| 1.3 | API: POST booking baru                   | Validasi input (zod), cek bentrok slot (server-side), insert ke tabel booking, return booking ID                                                                         | Server action `createBooking`                      |
| 1.4 | API: POST upload bukti bayar             | Terima file + booking ID, upload ke Supabase Storage bucket `bukti-bayar`, update kolom `bukti_pembayaran_url` di tabel booking                                          | Server action `uploadBuktiBayar`                   |
| 1.5 | API: GET booking by ID (public)          | Untuk halaman sukses & cek status                                                                                                                                        | Server action `getBookingById`                     |
| 1.6 | API: GET pengaturan (rekening, WA, QRIS) | Ambil dari tabel `pengaturan`                                                                                                                                            | Server action `getPengaturan`                      |
| 1.7 | Middleware Auth Admin                    | `middleware.ts` — redirect ke `/admin/login` jika belum login, hanya untuk route `/admin/*`                                                                              | `src/middleware.ts`                                |

### PHASE 2: Frontend — Public (User)

| #   | Task                                  | Detail                                                                                                                                                  | File/Folder                                           |
| --- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| 2.1 | Landing page `/`                      | Hero section + grid lapangan (fetch API 1.1), card: foto, nama, harga/jam, tombol "Pesan"                                                               | `src/app/page.tsx`, `src/components/LapanganCard.tsx` |
| 2.2 | Halaman detail `/lapangan/[id]`       | Foto besar, info, harga. Date picker (shadcn/ui atau native input date, range hari ini s/d +30)                                                         | `src/app/lapangan/[id]/page.tsx`                      |
| 2.3 | Komponen Slot Picker                  | Fetch slot kosong (API 1.2), render grid tombol jam. State: selected slot. Hitung total harga real-time.                                                | `src/components/SlotPicker.tsx`                       |
| 2.4 | Form data diri + konfirmasi           | Nama, no HP (masking 08), catatan (max 200). Validasi zod. Submit → insert booking (API 1.3). Loading state, error handling.                            | `src/components/FormBooking.tsx`                      |
| 2.5 | Halaman sukses `/booking/[id]/sukses` | Fetch booking (API 1.5), tampilkan ringkasan + status badge. Fetch pengaturan (API 1.6) → tampilkan rekening + QRIS. Komponen upload bukti + tombol WA. | `src/app/booking/[id]/sukses/page.tsx`                |
| 2.6 | Komponen Upload Bukti Bayar           | Drag-and-drop zone, preview foto, validasi ukuran & format, progress bar, upload ke Supabase Storage (API 1.4), toast sukses/gagal                      | `src/components/UploadBukti.tsx`                      |
| 2.7 | Halaman cek status `/cek-booking`     | Input booking ID → fetch status + ringkasan booking                                                                                                     | `src/app/cek-booking/page.tsx`                        |

### PHASE 3: Frontend — Admin Dashboard

| #   | Task                                   | Detail                                                                                                                       | File/Folder                                                                |
| --- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| 3.1 | Login page `/admin/login`              | Form email + password, Supabase Auth `signInWithPassword`, redirect ke `/admin`                                              | `src/app/admin/login/page.tsx`                                             |
| 3.2 | Layout dashboard admin                 | Sidebar navigasi (mobile: hamburger drawer), header: judul halaman + user info + logout                                      | `src/app/admin/layout.tsx`, `src/components/admin/Sidebar.tsx`             |
| 3.3 | Dashboard `/admin`                     | Stat cards: total booking hari ini, pending, lunas. Tabel 10 booking terbaru.                                                | `src/app/admin/page.tsx`                                                   |
| 3.4 | Halaman booking `/admin/booking`       | Fetch semua booking + filter (dropdown lapangan, date range, status). Tabel dengan kolom lengkap.                            | `src/app/admin/booking/page.tsx`                                           |
| 3.5 | Modal detail booking                   | Klik baris → drawer/modal: info pemesan, foto bukti bayar (lightbox), dropdown ubah status (Pending→Lunas/Batal), tombol WA. | `src/components/admin/BookingDetailModal.tsx`                              |
| 3.6 | Kelola lapangan `/admin/lapangan`      | Tabel lapangan, tombol tambah, form modal (nama, deskripsi, harga, jam buka/tutup, upload foto), soft delete toggle.         | `src/app/admin/lapangan/page.tsx`, `src/components/admin/FormLapangan.tsx` |
| 3.7 | Halaman pengaturan `/admin/pengaturan` | Form: nama bank, no rekening, atas nama, upload QRIS, nomor WA admin. Simpan ke tabel `pengaturan`.                          | `src/app/admin/pengaturan/page.tsx`                                        |

### PHASE 4: Polishing & Deploy

| #   | Task                   | Detail                                                                                                                                              |
| --- | ---------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| 4.1 | Responsive polish      | Test semua halaman di HP (375px - 414px), perbaiki layout mobile                                                                                    |
| 4.2 | Loading & empty states | Skeleton loaders, empty state illustrations, error boundary                                                                                         |
| 4.3 | SEO metadata           | `generateMetadata()` untuk halaman public: landing, detail lapangan                                                                                 |
| 4.4 | Deploy Vercel          | Push ke GitHub, import ke Vercel, setup env vars (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`), deploy |
| 4.5 | Seed data awal         | Script SQL: 2-3 lapangan dummy, 1 admin account, pengaturan default                                                                                 |

---

## 5. ATURAN BISNIS PENTING

| Aturan                                          | Implementasi                                                                                                                                       |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Slot booking per jam bulat**                  | Jam mulai & selesai selalu bulat: 08:00, 09:00, dst. Tidak ada setengah jam.                                                                       |
| **1 booking = 1 slot 1 jam**                    | User tidak bisa booking lintas jam dalam 1 transaksi (bisa improve nanti).                                                                         |
| **Slot bentrok tidak bisa dipilih**             | Query: `SELECT jam_mulai, jam_selesai FROM booking WHERE lapangan_id = X AND tanggal_main = Y AND status != 'batal'` → exclude dari slot tersedia. |
| **Upload bukti bayar opsional**                 | User bisa pilih upload bukti ATAU konfirmasi via WA. Tidak wajib.                                                                                  |
| **Admin tidak bisa edit booking user**          | Admin hanya bisa ubah status + lihat. Data booking tetap seperti input user.                                                                       |
| **Jam operasional diambil dari tabel lapangan** | Setiap lapangan bisa punya jam buka/tutup berbeda. Tidak ada global default kecuali di pengaturan.                                                 |

---

## 6. STRUKTUR FOLDER REKOMENDASI

```
src/
├── app/
│   ├── layout.tsx              # Root layout + Toaster + Supabase provider
│   ├── page.tsx                # Landing page
│   ├── lapangan/
│   │   └── [id]/
│   │       └── page.tsx        # Detail lapangan + booking
│   ├── booking/
│   │   └── [id]/
│   │       └── sukses/
│   │           └── page.tsx    # Sukses + instruksi bayar
│   ├── cek-booking/
│   │   └── page.tsx            # Cek status booking
│   └── admin/
│       ├── layout.tsx          # Admin layout (sidebar + auth guard)
│       ├── page.tsx            # Dashboard
│       ├── login/
│       │   └── page.tsx        # Login admin
│       ├── booking/
│       │   └── page.tsx        # Kelola booking
│       ├── lapangan/
│       │   └── page.tsx        # Kelola lapangan
│       └── pengaturan/
│           └── page.tsx        # Pengaturan rekening, WA, QRIS
├── components/
│   ├── LapanganCard.tsx
│   ├── SlotPicker.tsx
│   ├── FormBooking.tsx
│   ├── UploadBukti.tsx
│   ├── BookingStatusBadge.tsx
│   └── admin/
│       ├── Sidebar.tsx
│       ├── BookingDetailModal.tsx
│       ├── FormLapangan.tsx
│       └── StatCard.tsx
├── lib/
│   ├── supabase.ts             # Server & client client
│   ├── slot-engine.ts          # Logic slot kosong
│   └── actions/                # Server actions
│       ├── lapangan.ts
│       ├── booking.ts
│       ├── upload.ts
│       └── pengaturan.ts
├── types/
│   └── index.ts                # Type definitions
└── middleware.ts               # Auth guard /admin/*
```

---
