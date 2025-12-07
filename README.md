# 📚 Lenteraku - Platform Literasi Digital & Gamifikasi

**Lenteraku** adalah aplikasi web berbasis React yang dirancang untuk meningkatkan minat baca siswa melalui pendekatan gamifikasi. Aplikasi ini memudahkan siswa untuk melaporkan kegiatan membaca mereka dan memungkinkan guru untuk memantau serta memberikan apresiasi.

![Lenteraku Banner](https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2022&auto=format&fit=crop)

## ✨ Fitur Utama

### 👨‍🎓 Untuk Siswa
*   **Gamifikasi Level & Poin**: Dapatkan poin (XP) setiap kali laporan disetujui dan naikkan levelmu dari "Pembaca Pemula" hingga "Master Literasi".
*   **Kirim Laporan Bacaan**: Form mudah untuk mengirimkan judul buku dan ringkasan cerita.
*   **Perbaikan Laporan (Revisi)**: Dapatkan feedback dari guru dan perbaiki laporanmu langsung dari aplikasi.
*   **Leaderboard**: Lihat peringkatmu dan teman-teman sekelasmu di papan peringkat.
*   **Pustaka Pribadi**: Riwayat semua buku yang pernah kamu baca dan laporkan.

### 👩‍🏫 Untuk Guru
*   **Dashboard Monitoring**: Pantau statistik membaca siswa, grafik minat baca per kelas, dan progress bulanan.
*   **Verifikasi Laporan**:
    *   **Setujui**: Berikan poin kepada siswa. Anda juga bisa menambahkan catatan apresiasi.
    *   **Tolak/Revisi**: Berikan catatan perbaikan agar siswa dapat belajar menulis ringkasan yang lebih baik.
*   **Manajemen Data**: Kelola data Sekolah, Kelas, dan Siswa dengan mudah (CRUD).
*   **Rekap Laporan**: Cetak atau export laporan literasi bulanan/tahunan ke Excel/PDF.

## 🛠️ Teknologi yang Digunakan
*   **Frontend**: [React](https://react.dev/) + [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Charts**: Recharts (Custom Implementation)

## 🚀 Cara Menjalankan Project

1.  **Clone Repository** (jika ada) atau download source code.
2.  **Install Dependencies**:
    ```bash
    npm install
    ```
3.  **Jalankan Development Server**:
    ```bash
    npm run dev
    ```
4.  Buka browser dan akses alamat yang muncul (biasanya `http://localhost:5173`).

## 🔐 Akun Demo (Default)

Aplikasi ini menggunakan *mock data* untuk demonstrasi. Anda bisa login menggunakan akun berikut:

| Role | Username | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Guru** | `guru1` | `123` | Akses penuh ke dashboard guru |
| **Siswa** | `adit` | `123` | Siswa Kelas 5A |
| **Siswa** | `jarwo` | `123` | Siswa Kelas 5A |

## 📝 Alur Penggunaan (Workflow)

1.  **Siswa** login dan mengirimkan laporan bacaan baru.
2.  Status laporan menjadi **"Menunggu"**.
3.  **Guru** login dan membuka menu **Verifikasi**.
4.  Guru memeriksa laporan:
    *   Jika bagus: Klik **Setujui** (bisa tambah catatan). Siswa dapat poin (+10 XP).
    *   Jika kurang: Klik **Tolak** atau beri catatan revisi. Status menjadi **"Ditolak"** atau tetap **"Menunggu"** (jika hanya revisi).
5.  **Siswa** melihat notifikasi dan feedback di menu **Pustaka**.
6.  Jika laporan **Ditolak** atau **Disetujui dengan Catatan**, tombol **"Perbaiki Laporan"** akan muncul. Siswa dapat mengklik tombol tersebut, memperbaiki laporan, dan mengirim ulang. Laporan yang disetujui tanpa catatan tidak dapat diedit kembali.
7.  Guru memverifikasi ulang. Poin hanya diberikan satu kali per laporan (tidak ada duplikasi poin untuk edit laporan yang sudah disetujui).

---
*Dibuat dengan ❤️ untuk kemajuan literasi Indonesia.*
