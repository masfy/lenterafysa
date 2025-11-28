import React, { useState, useRef, useEffect } from 'react';
import {
    School, Layout, Edit, Save, PlusCircle, Trash2, Users, FileText,
    Download, Printer, User, Camera, Lock, CheckCircle, XCircle,
    BarChart2, AlertCircle, BookOpen, Trophy
} from 'lucide-react';
import { SimpleBarChart, SimpleLineChart } from '../common/Charts';
import ModalKonfirmasi from '../common/ModalKonfirmasi';
import Footer from '../common/Footer';
import { NAMA_BULAN } from '../../data/mockData';

const DashboardGuru = ({
    laporan,
    users,
    setUsers,
    onVerify,
    currentView,
    setView,
    dataSekolah,
    setDataSekolah,
    dataKelas,
    setDataKelas,
    currentUser,
    setCurrentUser,
    triggerNotifikasi,
    onUpdateSekolah,
    onAddClass,
    onUpdateClass,
    onDeleteClass,
    onAddUser,
    onUpdateUser,
    onDeleteUser
}) => {
    const [editingId, setEditingId] = useState(null);
    const [filterBulan, setFilterBulan] = useState('all');
    const [filterTahun, setFilterTahun] = useState('all');
    const [filterKelas, setFilterKelas] = useState('all');

    const currentYear = new Date().getFullYear();
    const tahunOpsi = [];
    for (let i = -2; i <= 3; i++) { tahunOpsi.push(currentYear + i); }

    const [itemToDelete, setItemToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formKelas, setFormKelas] = useState({ nama: '', tahun_pelajaran: '' });
    const [formSiswa, setFormSiswa] = useState({ nama: '', username: '', password: '123', kelas: '' });
    const fileInputRef = useRef(null);

    // State for Rejection Note
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionNote, setRejectionNote] = useState('');

    useEffect(() => {
        if (editingId) {
            if (typeof editingId === 'string' && editingId.startsWith('K')) {
                const k = dataKelas.find(k => k.id === editingId);
                if (k) setFormKelas({ nama: k.nama, tahun_pelajaran: k.tahun_pelajaran });
            } else if (typeof editingId === 'string' && editingId.startsWith('S')) {
                const s = users.find(u => u.uid === editingId);
                if (s) setFormSiswa({ nama: s.nama_lengkap, username: s.username, password: s.password, kelas: s.kelas });
            }
        } else {
            setFormKelas({ nama: '', tahun_pelajaran: '' });
            setFormSiswa({ nama: '', username: '', password: '123', kelas: dataKelas[0]?.nama || '' });
        }
    }, [editingId, dataKelas, users]);

    // --- HANDLERS CRUD ---
    const handleSimpanKelas = (e) => {
        e.preventDefault();
        if (!formKelas.nama || !formKelas.tahun_pelajaran) { triggerNotifikasi("Semua field harus diisi!", 'error'); return; }
        const kelasBaru = { id: editingId || `K${Date.now()}`, nama: formKelas.nama, tahun_pelajaran: formKelas.tahun_pelajaran };
        if (editingId) {
            onUpdateClass(editingId, kelasBaru);
        } else {
            onAddClass(kelasBaru);
        }
        setEditingId(null); setFormKelas({ nama: '', tahun_pelajaran: '' });
    };

    const confirmHapus = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'kelas') {
            onDeleteClass(itemToDelete.id);
        } else if (itemToDelete.type === 'siswa') {
            onDeleteUser(itemToDelete.id);
        }
        setIsModalOpen(false); setItemToDelete(null);
    };

    const handleSimpanSiswa = (e) => {
        e.preventDefault();
        if (!formSiswa.nama || !formSiswa.username) { triggerNotifikasi("Nama dan Username wajib diisi!", 'error'); return; }
        const siswaData = {
            uid: editingId || `S${Date.now()}`, username: formSiswa.username, password: formSiswa.password || '123', role: "murid", nama_lengkap: formSiswa.nama,
            kelas: formSiswa.kelas, total_poin: editingId ? users.find(u => u.uid === editingId).total_poin : 0, level: editingId ? users.find(u => u.uid === editingId).level : 1,
            foto_url: editingId ? users.find(u => u.uid === editingId).foto_url : `https://api.dicebear.com/7.x/avataaars/svg?seed=${formSiswa.username}`
        };
        if (editingId) {
            onUpdateUser(editingId, siswaData);
        } else {
            onAddUser(siswaData);
        }
        setEditingId(null); setFormSiswa({ nama: '', username: '', password: '123', kelas: dataKelas[0]?.nama || '' });
    };

    const handleUpdateProfilGuru = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedGuru = { ...currentUser, nama_lengkap: formData.get('nama'), username: formData.get('username'), password: formData.get('password'), };
        onUpdateUser(currentUser.uid, updatedGuru);
        setCurrentUser(updatedGuru);
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newPhotoUrl = reader.result;
                const updatedGuru = { ...currentUser, foto_url: newPhotoUrl };
                onUpdateUser(currentUser.uid, updatedGuru);
                setCurrentUser(updatedGuru);
            };
            reader.readAsDataURL(file);
        }
    };

    const filteredLaporan = laporan.filter(l => {
        const student = users.find(u => u.uid === l.student_uid);
        const matchKelas = filterKelas === 'all' || (student && student.kelas === filterKelas);
        const date = new Date(l.tanggal_kirim);
        const bulanLaporan = date.getMonth() + 1;
        const tahunLaporan = date.getFullYear();
        const matchBulan = filterBulan === 'all' || bulanLaporan.toString() === filterBulan;
        const matchTahun = filterTahun === 'all' || tahunLaporan.toString() === filterTahun;
        return matchKelas && matchBulan && matchTahun;
    });

    const handleExportRekap = () => {
        const dataExport = filteredLaporan.map(l => {
            const student = users.find(u => u.uid === l.student_uid);
            return { ID_Laporan: l.report_id, Siswa: student?.nama_lengkap || 'Unknown', Kelas: student?.kelas || '-', Judul_Buku: l.judul_buku, Tanggal: l.tanggal_kirim, Status: l.status };
        });
        // Simple CSV export logic inline or imported helper
        const csvContent = "data:text/csv;charset=utf-8,"
            + Object.keys(dataExport[0]).join(",") + "\n"
            + dataExport.map(row => Object.values(row).join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rekap_laporan_lentera.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const [filterKelasSiswa, setFilterKelasSiswa] = useState('all');

    // Data Preparation for Charts
    const totalVerified = laporan.filter(r => r.status === 'Disetujui').length;
    const totalPending = laporan.filter(r => r.status === 'Menunggu').length;

    // Data Minat Baca per Kelas
    const classData = dataKelas.map(k => {
        const studentsInClass = users.filter(u => u.kelas === k.nama && u.role === 'murid');
        const reportsInClass = laporan.filter(l => studentsInClass.some(s => s.uid === l.student_uid));
        return { label: k.nama, value: reportsInClass.length };
    });

    // Data Progress (All 12 months)
    const progressData = NAMA_BULAN.map((label, index) => {
        const monthIndex = index; // 0-11
        const reportsInMonth = laporan.filter(l => {
            const date = new Date(l.tanggal_kirim);
            return date.getMonth() === monthIndex && date.getFullYear() === currentYear;
        });
        return { label: label.substring(0, 3), value: reportsInMonth.length };
    });

    const renderContent = () => {
        // Calculate Academic Year
        const now = new Date();
        const curMonth = now.getMonth(); // 0 = Jan, 6 = July
        const curYear = now.getFullYear();
        const academicYearDisplay = curMonth >= 6
            ? `${curYear}/${curYear + 1}`
            : `${curYear - 1}/${curYear}`;
        const displayTahunAjaran = dataSekolah.tahun_ajaran || academicYearDisplay;

        switch (currentView) {
            case 'sekolah': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <School size={120} className="text-rose-600" />
                    </div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                            <div className="p-3 bg-rose-100 rounded-xl text-rose-600 shadow-sm">
                                <School size={24} />
                            </div>
                            Data Sekolah
                        </h2>
                        {!editingId && (
                            <div className="flex flex-col items-end gap-6">
                                <button onClick={() => setEditingId('sekolah')} className="glass-button flex items-center gap-2 px-6 py-2.5 text-rose-600 rounded-xl font-bold hover:bg-rose-50">
                                    <Edit size={18} /> Edit Data
                                </button>
                            </div>
                        )}
                    </div>
                    {editingId === 'sekolah' ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            const updatedSekolah = {
                                ...dataSekolah,
                                nama: formData.get('nama'),
                                akreditasi: formData.get('akreditasi'),
                                alamat: formData.get('alamat'),
                                kepala_sekolah: formData.get('kepala_sekolah'),
                                tahun_ajaran: formData.get('tahun_ajaran')
                            };
                            onUpdateSekolah(updatedSekolah);
                            setEditingId(null);
                        }} className="space-y-6 max-w-2xl relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Nama Sekolah</label>
                                    <input name="nama" defaultValue={dataSekolah.nama} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Nama Sekolah" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Akreditasi</label>
                                    <select name="akreditasi" defaultValue={dataSekolah.akreditasi} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white/50 backdrop-blur-sm">
                                        <option value="A">Terakreditasi A</option>
                                        <option value="B">Terakreditasi B</option>
                                        <option value="C">Terakreditasi C</option>
                                        <option value="Belum Terakreditasi">Belum Terakreditasi</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Alamat</label>
                                    <input name="alamat" defaultValue={dataSekolah.alamat} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Alamat Sekolah" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Kepala Sekolah</label>
                                    <input name="kepala_sekolah" defaultValue={dataSekolah.kepala_sekolah} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Nama Kepala Sekolah" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-600">Tahun Pelajaran</label>
                                    <input name="tahun_ajaran" defaultValue={dataSekolah.tahun_ajaran || academicYearDisplay} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Contoh: 2024/2025" />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button className="bg-rose-600 hover:bg-rose-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-rose-200 transition-all transform active:scale-95">Simpan Perubahan</button>
                                <button type="button" onClick={() => setEditingId(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-2.5 rounded-xl font-bold transition-all">Batal</button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                            <div className="space-y-6">
                                <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Nama Sekolah</label>
                                    <p className="font-bold text-xl text-gray-800">{dataSekolah.nama}</p>
                                </div>
                                <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Alamat</label>
                                    <p className="font-medium text-gray-800">{dataSekolah.alamat}</p>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="p-4 bg-white/40 rounded-xl border border-white/60">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Kepala Sekolah</label>
                                    <p className="font-medium text-gray-800">{dataSekolah.kepala_sekolah}</p>
                                </div>
                                <div className="p-4 bg-white/40 rounded-xl border border-white/60 flex flex-col justify-center">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 block">Tahun Pelajaran</label>
                                    <p className="font-bold text-lg text-indigo-900">{displayTahunAjaran}</p>
                                </div>
                            </div>
                            <div className="flex flex-col h-full">
                                {(() => {
                                    const akr = dataSekolah.akreditasi;
                                    let badgeClass = "bg-white/80 text-gray-600";
                                    let icon = <School size={32} />;
                                    if (akr === 'Belum Terakreditasi') { badgeClass = "bg-rose-100/80 text-rose-700 border-rose-200"; icon = <XCircle size={32} className="text-rose-600" />; }
                                    else if (akr.includes('A')) { badgeClass = "bg-emerald-100/80 text-emerald-700 border-emerald-200"; icon = <Trophy size={32} className="text-emerald-600" />; }
                                    else if (akr.includes('B')) { badgeClass = "bg-blue-100/80 text-blue-700 border-blue-200"; icon = <CheckCircle size={32} className="text-blue-600" />; }
                                    else if (akr.includes('C')) { badgeClass = "bg-amber-100/80 text-amber-700 border-amber-200"; icon = <AlertCircle size={32} className="text-amber-600" />; }
                                    else { badgeClass = "bg-gray-100/80 text-gray-700 border-gray-200"; icon = <School size={32} className="text-gray-600" />; }

                                    return (
                                        <div className={`h-full px-8 py-6 rounded-2xl font-bold shadow-lg border-2 flex flex-col items-center justify-center gap-2 ${badgeClass} backdrop-blur-md transform hover:scale-105 transition-transform relative z-20`}>
                                            <div className="p-3 bg-white/50 rounded-full shadow-sm">
                                                {icon}
                                            </div>
                                            <span className="text-2xl tracking-tight">{akr}</span>
                                            <span className="text-xs uppercase tracking-widest opacity-70">Terakreditasi</span>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}
                </div>
            );
            case 'kelas': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Layout size={120} className="text-cyan-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10">
                        <div className="p-3 bg-cyan-100 rounded-xl text-cyan-600 shadow-sm">
                            <Layout size={24} />
                        </div>
                        Data Kelas
                    </h2>
                    <form onSubmit={handleSimpanKelas} className="mb-8 glass-panel p-6 rounded-2xl flex gap-4 items-end flex-wrap relative z-10">
                        <div className="w-48">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nama Kelas</label>
                            <input value={formKelas.nama} onChange={e => setFormKelas({ ...formKelas, nama: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Ex: 1A" />
                        </div>
                        <div className="flex-1 min-w-[200px]">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tahun Pelajaran</label>
                            <input value={formKelas.tahun_pelajaran} onChange={e => setFormKelas({ ...formKelas, tahun_pelajaran: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="2024/2025" />
                        </div>
                        <button type="submit" className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-700 flex items-center gap-2 shadow-lg shadow-cyan-200 transition-all transform active:scale-95">
                            {editingId && typeof editingId === 'string' && editingId.startsWith('K') ? <Save size={18} /> : <PlusCircle size={18} />}
                            {editingId && typeof editingId === 'string' && editingId.startsWith('K') ? 'Update' : 'Tambah'}
                        </button>
                        {editingId && typeof editingId === 'string' && editingId.startsWith('K') && (
                            <button type="button" onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Batal</button>
                        )}
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {dataKelas.map((kelas, index) => {
                            const pastelColors = [
                                { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', badge: 'bg-rose-100', icon: 'text-rose-500' },
                                { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', badge: 'bg-orange-100', icon: 'text-orange-500' },
                                { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100', icon: 'text-amber-500' },
                                { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-100', icon: 'text-emerald-500' },
                                { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700', badge: 'bg-teal-100', icon: 'text-teal-500' },
                                { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-700', badge: 'bg-cyan-100', icon: 'text-cyan-500' },
                                { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', badge: 'bg-sky-100', icon: 'text-sky-500' },
                                { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-100', icon: 'text-indigo-500' },
                                { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', badge: 'bg-violet-100', icon: 'text-violet-500' },
                                { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', badge: 'bg-purple-100', icon: 'text-purple-500' },
                                { bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', text: 'text-fuchsia-700', badge: 'bg-fuchsia-100', icon: 'text-fuchsia-500' },
                                { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', badge: 'bg-pink-100', icon: 'text-pink-500' }
                            ];
                            const color = pastelColors[index % pastelColors.length];

                            return (
                                <div key={kelas.id} className={`p-6 rounded-2xl hover:shadow-lg transition-all relative group border ${color.border} ${color.bg} hover:bg-${color.bg.split('-')[1]}-100 hover:-translate-y-1 overflow-hidden`}>
                                    {/* Decorative background circle */}
                                    <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${color.badge} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>

                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                        <button onClick={() => { setEditingId(kelas.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 bg-white/80 text-blue-600 rounded-lg hover:bg-white transition-colors shadow-sm"><Edit size={16} /></button>
                                        <button onClick={() => { setItemToDelete({ type: 'kelas', id: kelas.id }); setIsModalOpen(true); }} className="p-2 bg-white/80 text-red-600 rounded-lg hover:bg-white transition-colors shadow-sm"><Trash2 size={16} /></button>
                                    </div>

                                    <div className="flex items-center gap-4 mb-4 relative z-10">
                                        <div className={`p-3 rounded-xl ${color.badge} ${color.icon} shadow-sm bg-white/50 backdrop-blur-sm`}>
                                            <Layout size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Kelas</p>
                                            <h3 className={`text-3xl font-extrabold ${color.text}`}>{kelas.nama}</h3>
                                        </div>
                                    </div>

                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl backdrop-blur-sm border border-white/30 group-hover:bg-white/60 transition-colors">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                                <Users size={16} className="text-gray-500" /> Siswa
                                            </span>
                                            <span className={`text-sm ${color.badge} ${color.text} px-3 py-1 rounded-full font-bold`}>
                                                {users.filter(u => u.role === 'murid' && u.kelas === kelas.nama).length}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/40 rounded-xl backdrop-blur-sm border border-white/30 group-hover:bg-white/60 transition-colors">
                                            <span className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                                <BookOpen size={16} className="text-gray-500" /> Tahun
                                            </span>
                                            <span className="font-bold text-gray-700 text-sm">{kelas.tahun_pelajaran}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div >
                </div >
            );
            case 'siswa': return (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card rounded-2xl p-8">
                        <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2">
                            {editingId && typeof editingId === 'string' && editingId.startsWith('S') ? <Edit className="text-blue-600" /> : <PlusCircle className="text-blue-600" />}
                            {editingId && typeof editingId === 'string' && editingId.startsWith('S') ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                        </h3>
                        <form onSubmit={handleSimpanSiswa} className="flex gap-4 items-end flex-wrap">
                            <div className="flex-1 min-w-[200px]">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Nama Lengkap</label>
                                <input value={formSiswa.nama} onChange={e => setFormSiswa({ ...formSiswa, nama: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Nama Siswa" />
                            </div>
                            <div className="w-40">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Kelas</label>
                                <select value={formSiswa.kelas} onChange={e => setFormSiswa({ ...formSiswa, kelas: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 backdrop-blur-sm">
                                    <option value="" disabled>Pilih Kelas</option>
                                    {dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                                </select>
                            </div>
                            <div className="w-40">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Username</label>
                                <input value={formSiswa.username} onChange={e => setFormSiswa({ ...formSiswa, username: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-white/50 backdrop-blur-sm" placeholder="Username" />
                            </div>
                            <div className="w-32">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Password</label>
                                <input value={formSiswa.password} onChange={e => setFormSiswa({ ...formSiswa, password: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 outline-none transition-all bg-gray-50/50" />
                            </div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg shadow-blue-200 transition-all transform active:scale-95">
                                {editingId && typeof editingId === 'string' && editingId.startsWith('S') ? <Save size={18} /> : <PlusCircle size={18} />} Simpan
                            </button>
                            {editingId && typeof editingId === 'string' && editingId.startsWith('S') && (
                                <button type="button" onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-200 transition-all">Batal</button>
                            )}
                        </form>
                    </div>
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/30 backdrop-blur-sm">
                            <div>
                                <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Users className="text-blue-600" /> Data Akun Siswa</h2>
                                <p className="text-sm text-gray-500 mt-1 font-medium">Total: {users.filter(u => u.role === 'murid' && (filterKelasSiswa === 'all' || u.kelas === filterKelasSiswa)).length} Siswa</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Filter Kelas:</label>
                                <select value={filterKelasSiswa} onChange={e => setFilterKelasSiswa(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-blue-200 outline-none">
                                    <option value="all">Semua Kelas</option>
                                    {dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs">
                                    <tr>
                                        <th className="p-4 font-bold">UID</th>
                                        <th className="p-4 font-bold">Nama Lengkap</th>
                                        <th className="p-4 font-bold">Username</th>
                                        <th className="p-4 font-bold">Kelas</th>
                                        <th className="p-4 font-bold">Poin</th>
                                        <th className="p-4 font-bold text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {users.filter(u => u.role === 'murid' && (filterKelasSiswa === 'all' || u.kelas === filterKelasSiswa)).map(siswa => (
                                        <tr key={siswa.uid} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="p-4 text-gray-500 font-mono text-xs">{siswa.uid}</td>
                                            <td className="p-4 font-bold text-gray-700">{siswa.nama_lengkap}</td>
                                            <td className="p-4"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">{siswa.username}</span></td>
                                            <td className="p-4 text-gray-600 font-medium">{siswa.kelas}</td>
                                            <td className="p-4 text-gray-600 font-bold">{siswa.total_poin}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => { setEditingId(siswa.uid); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg transition-colors"><Edit size={18} /></button>
                                                <button onClick={() => { setItemToDelete({ type: 'siswa', id: siswa.uid }); setIsModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-100 rounded-lg transition-colors"><Trash2 size={18} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
            case 'rekap': return (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <FileText size={120} className="text-violet-600" />
                        </div>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10">
                            <div className="p-3 bg-violet-100 rounded-xl text-violet-600 shadow-sm">
                                <FileText size={24} />
                            </div>
                            Rekap Laporan
                        </h2>
                        <div className="flex flex-wrap gap-4 mb-8 items-end relative z-10">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Filter Kelas</label>
                                <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[150px] bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-200 outline-none">
                                    <option value="all">Semua Kelas</option>
                                    {dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Filter Bulan</label>
                                <select value={filterBulan} onChange={e => setFilterBulan(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[150px] bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-200 outline-none">
                                    <option value="all">Semua Bulan</option>
                                    {NAMA_BULAN.map((bulan, index) => (<option key={index} value={index + 1}>{bulan}</option>))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Filter Tahun</label>
                                <select value={filterTahun} onChange={e => setFilterTahun(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[150px] bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-violet-200 outline-none">
                                    <option value="all">Semua Tahun</option>
                                    {tahunOpsi.map((tahun) => (<option key={tahun} value={tahun}>{tahun}</option>))}
                                </select>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-3">
                                <button onClick={handleExportRekap} className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200 transition-all shadow-sm"><Download size={18} /> Export Excel</button>
                                <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all shadow-sm"><Printer size={18} /> Cetak PDF</button>
                            </div>
                        </div>
                        <div className="overflow-hidden rounded-xl border border-gray-100/50 relative z-10">
                            <table className="w-full text-left text-sm border-collapse">
                                <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs">
                                    <tr className="border-b border-gray-100">
                                        <th className="p-4 font-bold">Tanggal</th>
                                        <th className="p-4 font-bold">Siswa</th>
                                        <th className="p-4 font-bold">Kelas</th>
                                        <th className="p-4 font-bold">Judul Buku</th>
                                        <th className="p-4 font-bold">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {filteredLaporan.length > 0 ? filteredLaporan.map((l, idx) => {
                                        const student = users.find(u => u.uid === l.student_uid);
                                        return (
                                            <tr key={idx} className="hover:bg-violet-50/30 transition-colors">
                                                <td className="p-4 text-gray-600 font-medium">{l.tanggal_kirim}</td>
                                                <td className="p-4 font-bold text-gray-800">{student?.nama_lengkap}</td>
                                                <td className="p-4 text-center text-gray-500">{student?.kelas}</td>
                                                <td className="p-4 text-gray-700">{l.judul_buku}</td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${l.status === 'Disetujui' ? 'bg-green-100 text-green-700' : l.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>
                                                        {l.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        )
                                    }) : (
                                        <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium">Tidak ada data yang sesuai dengan filter.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            );
            case 'leaderboard': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Trophy size={120} className="text-amber-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10">
                        <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-sm">
                            <Trophy size={24} />
                        </div>
                        Peringkat Sekolah
                    </h2>
                    <div className="space-y-4 relative z-10">
                        {users.filter(u => u.role === 'murid').sort((a, b) => b.total_poin - a.total_poin).map((u, i) => {
                            const pastelColors = [
                                { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', badge: 'bg-rose-100', icon: 'text-rose-500' },
                                { bg: 'bg-orange-50', border: 'border-orange-100', text: 'text-orange-700', badge: 'bg-orange-100', icon: 'text-orange-500' },
                                { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', badge: 'bg-amber-100', icon: 'text-amber-500' },
                                { bg: 'bg-emerald-50', border: 'border-emerald-100', text: 'text-emerald-700', badge: 'bg-emerald-100', icon: 'text-emerald-500' },
                                { bg: 'bg-teal-50', border: 'border-teal-100', text: 'text-teal-700', badge: 'bg-teal-100', icon: 'text-teal-500' },
                                { bg: 'bg-cyan-50', border: 'border-cyan-100', text: 'text-cyan-700', badge: 'bg-cyan-100', icon: 'text-cyan-500' },
                                { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', badge: 'bg-sky-100', icon: 'text-sky-500' },
                                { bg: 'bg-indigo-50', border: 'border-indigo-100', text: 'text-indigo-700', badge: 'bg-indigo-100', icon: 'text-indigo-500' },
                                { bg: 'bg-violet-50', border: 'border-violet-100', text: 'text-violet-700', badge: 'bg-violet-100', icon: 'text-violet-500' },
                                { bg: 'bg-purple-50', border: 'border-purple-100', text: 'text-purple-700', badge: 'bg-purple-100', icon: 'text-purple-500' },
                                { bg: 'bg-fuchsia-50', border: 'border-fuchsia-100', text: 'text-fuchsia-700', badge: 'bg-fuchsia-100', icon: 'text-fuchsia-500' },
                                { bg: 'bg-pink-50', border: 'border-pink-100', text: 'text-pink-700', badge: 'bg-pink-100', icon: 'text-pink-500' }
                            ];
                            const color = pastelColors[i % pastelColors.length];

                            return (
                                <div key={u.uid} className={`flex items-center p-4 rounded-2xl hover:shadow-lg transition-all transform hover:-translate-y-1 border ${color.border} ${color.bg} hover:bg-${color.bg.split('-')[1]}-100`}>
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl mr-6 shadow-sm ${i < 3 ? 'bg-white/80 backdrop-blur-sm' : 'bg-white/50'} ${color.text}`}>
                                        {i + 1}
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-gray-100 mr-4 overflow-hidden border-2 border-white shadow-sm">
                                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} alt="avatar" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-lg ${color.text}`}>{u.nama_lengkap}</h4>
                                        <p className="text-sm text-gray-500 font-medium">Kelas {u.kelas}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`block font-extrabold text-2xl ${color.text}`}>{u.total_poin}</span>
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Poin</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
            case 'profil': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in max-w-2xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <User size={120} className="text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10">
                        <div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm">
                            <User size={24} />
                        </div>
                        Profil Guru
                    </h2>
                    <form onSubmit={handleUpdateProfilGuru} className="space-y-6 relative z-10">
                        <div className="flex items-center gap-8 mb-8">
                            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-xl overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <img src={currentUser.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                                    <Camera className="text-white" size={32} />
                                </div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                            <div>
                                <h3 className="font-bold text-2xl text-gray-800">{currentUser.nama_lengkap}</h3>
                                <p className="text-indigo-600 font-medium">Guru Pengajar</p>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-2">Nama Lengkap</label>
                                <input name="nama" defaultValue={currentUser.nama_lengkap} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 backdrop-blur-sm" required />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-2">Username Login</label>
                                <input name="username" defaultValue={currentUser.username} className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 backdrop-blur-sm" required />
                            </div>
                            <div>
                                <label className="text-sm font-bold text-gray-600 block mb-2">Password</label>
                                <div className="relative">
                                    <input name="password" type="text" defaultValue={currentUser.password} className="w-full p-3 border border-gray-200 rounded-xl pr-10 focus:ring-2 focus:ring-indigo-200 outline-none transition-all bg-white/50 backdrop-blur-sm" required />
                                    <Lock className="absolute right-3 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 transform active:scale-95 mt-4">Simpan Perubahan</button>
                    </form>
                </div>
            );
            case 'verifikasi': return (
                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/30 backdrop-blur-sm">
                        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2">
                            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                                <CheckCircle size={20} />
                            </div>
                            Verifikasi Laporan
                        </h3>
                        <span className="text-xs font-bold bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full shadow-sm">{laporan.filter(r => r.status === 'Menunggu').length} Menunggu</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs">
                                <tr>
                                    <th className="p-4 font-bold">Siswa</th>
                                    <th className="p-4 font-bold">Judul Buku</th>
                                    <th className="p-4 font-bold">Ringkasan</th>
                                    <th className="p-4 font-bold">Tanggal</th>
                                    <th className="p-4 font-bold text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100/50">
                                {laporan.filter(r => r.status === 'Menunggu').length === 0 ? (
                                    <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium flex flex-col items-center gap-2"><CheckCircle size={48} className="text-emerald-200" />Tidak ada laporan yang perlu diverifikasi.</td></tr>
                                ) : (
                                    laporan.filter(r => r.status === 'Menunggu').map(lap => (
                                        <tr key={lap.report_id} className="hover:bg-emerald-50/30 transition-colors">
                                            <td className="p-4 font-bold text-gray-800">
                                                {users.find(u => u.uid === lap.student_uid)?.nama_lengkap || 'Tidak Dikenal'}
                                                <div className="text-xs text-gray-400 font-normal mt-0.5">{users.find(u => u.uid === lap.student_uid)?.kelas}</div>
                                            </td>
                                            <td className="p-4 text-gray-700 font-medium">{lap.judul_buku}</td>
                                            <td className="p-4 text-gray-500 max-w-xs truncate">{lap.ringkasan}</td>
                                            <td className="p-4 text-gray-500">{lap.tanggal_kirim}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button onClick={() => onVerify(lap.report_id, true)} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors shadow-sm" title="Setujui"><CheckCircle className="w-5 h-5" /></button>
                                                    <button onClick={() => { setRejectingId(lap.report_id); setRejectionNote(''); }} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors shadow-sm" title="Tolak"><XCircle className="w-5 h-5" /></button>
                                                </div>
                                                {rejectingId === lap.report_id && (
                                                    <div className="mt-2 p-3 bg-red-50 rounded-xl border border-red-100 animate-fade-in text-left">
                                                        <textarea
                                                            value={rejectionNote}
                                                            onChange={(e) => setRejectionNote(e.target.value)}
                                                            placeholder="Alasan penolakan..."
                                                            className="w-full p-2 border border-red-200 rounded-lg text-sm focus:ring-2 focus:ring-red-200 outline-none mb-2 bg-white"
                                                            rows="2"
                                                        />
                                                        <div className="flex gap-2 justify-end">
                                                            <button onClick={() => setRejectingId(null)} className="px-3 py-1 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">Batal</button>
                                                            <button onClick={() => { onVerify(lap.report_id, false, rejectionNote); setRejectingId(null); }} className="px-3 py-1 text-xs font-bold bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm">Kirim Penolakan</button>
                                                        </div>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
            case 'dashboard':
            default:
                const totalStudents = users.filter(u => u.role === 'murid').length;
                return (
                    <div className="space-y-8 animate-fade-in pb-8">
                        {/* SECTION 1: STATISTIK UTAMA (KARTU) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Siswa', value: totalStudents, icon: Users, color: 'blue', delay: '0s' },
                                { label: 'Sudah Diverifikasi', value: totalVerified, icon: CheckCircle, color: 'green', delay: '0.1s' },
                                { label: 'Belum Diverifikasi', value: totalPending, icon: AlertCircle, color: 'orange', delay: '0.2s' },
                                { label: 'Total Laporan', value: laporan.length, icon: BookOpen, color: 'purple', delay: '0.3s' }
                            ].map((stat, idx) => (
                                <div key={idx} className="glass-card p-6 rounded-2xl flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all duration-300 group" style={{ animationDelay: stat.delay }}>
                                    <div className={`p-4 rounded-2xl bg-${stat.color}-100 text-${stat.color}-600 shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                                        <stat.icon className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-sm font-bold mb-1">{stat.label}</p>
                                        <h3 className="text-3xl font-extrabold text-gray-800">{stat.value}</h3>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* SECTION 2: GRAFIK (CHART) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
                            <SimpleBarChart
                                data={classData}
                                title={`Minat Baca per Kelas (${displayTahunAjaran})`}
                                color="bg-indigo-500"
                            />
                            <SimpleBarChart
                                data={progressData}
                                title={`Progress Membaca Bulanan (${displayTahunAjaran})`}
                                colors={[
                                    'bg-rose-300', 'bg-orange-300', 'bg-amber-300',
                                    'bg-emerald-300', 'bg-teal-300', 'bg-cyan-300',
                                    'bg-sky-300', 'bg-indigo-300', 'bg-violet-300',
                                    'bg-purple-300', 'bg-fuchsia-300', 'bg-pink-300'
                                ]}
                            />
                        </div>

                        {/* SECTION 3: QUICK ACCESS (PASTEL COLORS) */}
                        <div className="pt-4">
                            <h3 className="text-lg font-bold text-gray-700 mb-4 ml-1">Akses Cepat</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
                                {[
                                    { id: 'verifikasi', label: 'Verifikasi', icon: CheckCircle, color: 'emerald' },
                                    { id: 'siswa', label: 'Data Siswa', icon: Users, color: 'blue' },
                                    { id: 'rekap', label: 'Laporan', icon: FileText, color: 'violet' },
                                    { id: 'leaderboard', label: 'Peringkat', icon: Trophy, color: 'amber' },
                                    { id: 'sekolah', label: 'Data Sekolah', icon: School, color: 'rose' },
                                    { id: 'kelas', label: 'Data Kelas', icon: Layout, color: 'cyan' }
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => setView(item.id)}
                                        className={`p-5 rounded-2xl bg-${item.color}-50 hover:bg-${item.color}-100 text-${item.color}-700 transition-all transform hover:-translate-y-2 hover:shadow-lg flex flex-col items-center gap-3 group border border-${item.color}-100 relative overflow-hidden`}
                                    >
                                        <div className={`absolute top-0 right-0 p-8 bg-${item.color}-200 rounded-bl-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                                        <div className={`p-3.5 bg-${item.color}-200 rounded-xl text-${item.color}-700 group-hover:scale-110 transition-transform shadow-sm relative z-10`}>
                                            <item.icon size={28} />
                                        </div>
                                        <span className="font-bold text-sm relative z-10">{item.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 relative overflow-hidden">
            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-orbit" style={{ animationDuration: '25s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-orbit" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
            </div>

            <ModalKonfirmasi
                isOpen={isModalOpen}
                pesan={itemToDelete?.type === 'kelas' ? "Apakah Anda yakin ingin menghapus kelas ini? Semua siswa di kelas ini mungkin kehilangan data kelasnya." : "Apakah Anda yakin ingin menghapus siswa ini? Tindakan ini tidak dapat dibatalkan."}
                onConfirm={confirmHapus}
                onCancel={() => setIsModalOpen(false)}
            />
            <div className="flex-none px-8 pt-8 pb-4 relative z-10">
                <header className="flex justify-between items-center glass-panel p-4 rounded-2xl">
                    <div><h1 className="text-3xl font-bold text-gray-800 capitalize">{currentView.replace('-', ' ')}</h1><p className="text-gray-500 font-medium">Selamat datang kembali, {currentUser.nama_lengkap}</p></div>
                    <div className="flex items-center gap-4">
                        <div className="bg-white/80 backdrop-blur-sm p-2 px-4 rounded-xl shadow-sm border border-white text-sm text-gray-600 flex items-center gap-2 font-bold"><div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div> Online</div>
                        <div onClick={() => setView('profil')} className="w-12 h-12 rounded-full bg-gray-200 border-4 border-white shadow-md overflow-hidden cursor-pointer hover:ring-4 ring-indigo-200 transition-all transform hover:scale-105"><img src={currentUser.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} alt="Profile" className="w-full h-full object-cover" /></div>
                    </div>
                </header>
            </div>
            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar relative z-10">{renderContent()}</div>
            <div className="flex-none border-t bg-white/80 backdrop-blur-md z-20"><Footer /></div>
        </div>
    );
};

export default DashboardGuru;
