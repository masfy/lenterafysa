export const PENGGUNA_AWAL = [
    {
        uid: "U001",
        username: "guru1",
        password: "123",
        role: "guru",
        nama_lengkap: "Pak Budi",
        nip: "19850101 201001 1 001",
        foto_url: "",
        kelas: "-",
        total_poin: 0,
        level: "-"
    },
    {
        uid: "S001",
        username: "adit",
        password: "123",
        role: "murid",
        nama_lengkap: "Adit Sopo",
        kelas: "5A",
        total_poin: 120,
        level: 2
    },
    {
        uid: "S002",
        username: "jarwo",
        password: "123",
        role: "murid",
        nama_lengkap: "Jarwo Kuat",
        kelas: "5A",
        total_poin: 40,
        level: 1
    },
    {
        uid: "S003",
        username: "denis",
        password: "123",
        role: "murid",
        nama_lengkap: "Denis Cadel",
        kelas: "5B",
        total_poin: 160,
        level: 3
    }
];

export const LAPORAN_AWAL = [
    {
        report_id: "R001",
        student_uid: "S001",
        judul_buku: "Si Kancil",
        ringkasan: "Cerita tentang kancil yang cerdik menipu buaya untuk menyeberang sungai.",
        tanggal_kirim: "2023-10-01",
        status: "Disetujui",
        feedback_guru: "Ringkasan sangat bagus, Adit!"
    },
    {
        report_id: "R002",
        student_uid: "S002",
        judul_buku: "Malin Kundang",
        ringkasan: "Anak durhaka yang dikutuk menjadi batu.",
        tanggal_kirim: "2023-10-02",
        status: "Menunggu",
        feedback_guru: ""
    },
    {
        report_id: "R003",
        student_uid: "S003",
        judul_buku: "Laskar Pelangi",
        ringkasan: "Perjuangan anak-anak belitung bersekolah.",
        tanggal_kirim: "2025-01-15",
        status: "Disetujui",
        feedback_guru: "Inspiratif!"
    },
    { report_id: "R004", student_uid: "S003", judul_buku: "Bumi", ringkasan: "...", tanggal_kirim: "2023-11-10", status: "Disetujui", feedback_guru: "" },
    { report_id: "R005", student_uid: "S001", judul_buku: "Matahari", ringkasan: "...", tanggal_kirim: "2023-12-05", status: "Disetujui", feedback_guru: "" },
    { report_id: "R006", student_uid: "S002", judul_buku: "Bulan", ringkasan: "...", tanggal_kirim: "2023-12-20", status: "Menunggu", feedback_guru: "" },
];

export const DATA_SEKOLAH_AWAL = {
    nama: "SD Lentera Bangsa",
    alamat: "Jl. Pendidikan No. 123, Jakarta",
    akreditasi: "A",
    kepala_sekolah: "Dr. Siti Aminah",
    nip_kepala_sekolah: "19700101 199501 2 001",
    tahun_ajaran: "2024/2025",
    kota: "Jakarta"
};

export const DATA_KELAS_AWAL = [
    { id: "K01", nama: "1A", tahun_pelajaran: "2024/2025" },
    { id: "K02", nama: "1B", tahun_pelajaran: "2024/2025" },
    { id: "K05", nama: "5A", tahun_pelajaran: "2024/2025" },
    { id: "K06", nama: "5B", tahun_pelajaran: "2024/2025" },
];

export const NAMA_BULAN = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export const LEVELS = [
    { level: 1, label: "Pembaca Pemula", min: 0, max: 50 },
    { level: 2, label: "Penjelajah Buku", min: 51, max: 150 },
    { level: 3, label: "Master Literasi", min: 151, max: 9999 }
];

export const hitungLevel = (poin) => {
    const lvl = LEVELS.find(l => poin >= l.min && poin <= l.max);
    return lvl ? lvl.level : 3;
};

export const infoLevel = (level) => LEVELS.find(l => l.level === level) || LEVELS[0];

export const DATA_BUKU = [
    { id: 1, judul: "Laskar Pelangi", penulis: "Andrea Hirata", kategori: "Fiksi", cover: "https://cdn.gramedia.com/uploads/items/9789793062792_laskar-pelangi.jpg" },
    { id: 2, judul: "Bumi", penulis: "Tere Liye", kategori: "Fiksi", cover: "https://cdn.gramedia.com/uploads/items/9786020332956_Bumi-New-Cover.jpg" },
    { id: 3, judul: "Si Kancil", penulis: "Tira Ikranegara", kategori: "Dongeng", cover: "https://cdn.gramedia.com/uploads/items/9786021097687_si-kancil.jpg" },
    { id: 4, judul: "Ensiklopedia Sains", penulis: "DK", kategori: "Sains", cover: "https://cdn.gramedia.com/uploads/items/9789792276534_ensiklopedia-sains.jpg" },
    { id: 5, judul: "Harry Potter", penulis: "J.K. Rowling", kategori: "Fiksi", cover: "https://cdn.gramedia.com/uploads/items/9786020386201_Harry-Potter-dan-Batu-Bertuah-New-Cover.jpg" },
    { id: 6, judul: "Malin Kundang", penulis: "Rini K.", kategori: "Dongeng", cover: "https://cdn.gramedia.com/uploads/items/9786029787689_cerita-rakyat-nusantara-malin-kundang.jpg" },
];
