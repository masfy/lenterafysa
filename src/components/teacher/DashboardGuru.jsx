
import React, { useState, useRef, useEffect } from 'react';
import {
    Layout, Users, FileText, CheckCircle, XCircle, LogOut, ChevronRight,
    School, MapPin, User, Award, Calendar, Edit, Trash2, Download, Printer,
    Search, Filter, Plus, Save, X, Camera, Lock, Trophy, Medal, Crown, Star, AlertCircle, BookOpen
} from 'lucide-react';
import { SimpleBarChart, SimpleLineChart } from '../common/Charts';
import ModalKonfirmasi from '../common/ModalKonfirmasi';
import Footer from '../common/Footer';
import { NAMA_BULAN } from '../../data/mockData';

const DashboardGuru = ({
    laporan, users, setUsers, onVerify, currentView, setView,
    dataSekolah, setDataSekolah, dataKelas, setDataKelas,
    currentUser, setCurrentUser, triggerNotifikasi,
    onUpdateSekolah, onAddClass, onUpdateClass, onDeleteClass,
    onAddUser, onUpdateUser, onDeleteUser
}) => {
    // Static Color Definitions for Tailwind
    const THEME_COLORS = {
        blue: { bg: 'bg-blue-100', text: 'text-blue-600', soft: 'bg-blue-50', hover: 'hover:bg-blue-100', dark: 'text-blue-700', border: 'border-blue-100', icon: 'bg-blue-200' },
        green: { bg: 'bg-green-100', text: 'text-green-600', soft: 'bg-green-50', hover: 'hover:bg-green-100', dark: 'text-green-700', border: 'border-green-100', icon: 'bg-green-200' },
        orange: { bg: 'bg-orange-100', text: 'text-orange-600', soft: 'bg-orange-50', hover: 'hover:bg-orange-100', dark: 'text-orange-700', border: 'border-orange-100', icon: 'bg-orange-200' },
        purple: { bg: 'bg-purple-100', text: 'text-purple-600', soft: 'bg-purple-50', hover: 'hover:bg-purple-100', dark: 'text-purple-700', border: 'border-purple-100', icon: 'bg-purple-200' },
        emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600', soft: 'bg-emerald-50', hover: 'hover:bg-emerald-100', dark: 'text-emerald-700', border: 'border-emerald-100', icon: 'bg-emerald-200' },
        violet: { bg: 'bg-violet-100', text: 'text-violet-600', soft: 'bg-violet-50', hover: 'hover:bg-violet-100', dark: 'text-violet-700', border: 'border-violet-100', icon: 'bg-violet-200' },
        amber: { bg: 'bg-amber-100', text: 'text-amber-600', soft: 'bg-amber-50', hover: 'hover:bg-amber-100', dark: 'text-amber-700', border: 'border-amber-100', icon: 'bg-amber-200' },
        rose: { bg: 'bg-rose-100', text: 'text-rose-600', soft: 'bg-rose-50', hover: 'hover:bg-rose-100', dark: 'text-rose-700', border: 'border-rose-100', icon: 'bg-rose-200' },
        cyan: { bg: 'bg-cyan-100', text: 'text-cyan-600', soft: 'bg-cyan-50', hover: 'hover:bg-cyan-100', dark: 'text-cyan-700', border: 'border-cyan-100', icon: 'bg-cyan-200' },
        gray: { bg: 'bg-gray-100', text: 'text-gray-600', soft: 'bg-gray-50', hover: 'hover:bg-gray-100', dark: 'text-gray-700', border: 'border-gray-200', icon: 'bg-gray-200' },
    };

    const [editingId, setEditingId] = useState(null);
    const [filterBulan, setFilterBulan] = useState('all');
    const [filterTahun, setFilterTahun] = useState('all');
    const [filterKelas, setFilterKelas] = useState('all');

    // New State for Print
    const [filterTipe, setFilterTipe] = useState('Bulanan');
    const [bulanLaporan, setBulanLaporan] = useState(new Date().getMonth());
    const [tahunLaporan, setTahunLaporan] = useState(new Date().getFullYear());

    const currentYear = new Date().getFullYear();
    const tahunOpsi = [];
    for (let i = -2; i <= 3; i++) { tahunOpsi.push(currentYear + i); }

    const [itemToDelete, setItemToDelete] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formKelas, setFormKelas] = useState({ nama: '', tahun_pelajaran: '' });
    const [formSiswa, setFormSiswa] = useState({ nama: '', username: '', password: '123', kelas: '' });
    const fileInputRef = useRef(null);
    const [rejectingId, setRejectingId] = useState(null);
    const [rejectionNote, setRejectionNote] = useState('');
    const [filterKelasSiswa, setFilterKelasSiswa] = useState('all');
    const [filterKelasLeaderboard, setFilterKelasLeaderboard] = useState('all');

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

    const handleSimpanKelas = (e) => {
        e.preventDefault();
        if (!formKelas.nama || !formKelas.tahun_pelajaran) { triggerNotifikasi("Semua field harus diisi!", 'error'); return; }
        const kelasBaru = { id: editingId || `K${Date.now()}`, nama: formKelas.nama, tahun_pelajaran: formKelas.tahun_pelajaran };
        if (editingId) onUpdateClass(editingId, kelasBaru); else onAddClass(kelasBaru);
        setEditingId(null); setFormKelas({ nama: '', tahun_pelajaran: '' });
    };

    const confirmHapus = () => {
        if (!itemToDelete) return;
        if (itemToDelete.type === 'kelas') onDeleteClass(itemToDelete.id);
        else if (itemToDelete.type === 'siswa') onDeleteUser(itemToDelete.id);
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
        if (editingId) onUpdateUser(editingId, siswaData); else onAddUser(siswaData);
        setEditingId(null); setFormSiswa({ nama: '', username: '', password: '123', kelas: dataKelas[0]?.nama || '' });
    };

    const handleUpdateProfilGuru = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedGuru = {
            ...currentUser,
            nama_lengkap: formData.get('nama'),
            username: formData.get('username'),
            password: formData.get('password'),
            nip: formData.get('nip')
        };
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
        const matchKelas = filterKelas === 'all' || users.find(u => u.uid === l.student_uid)?.kelas === filterKelas;
        const d = new Date(l.tanggal_kirim);
        const matchWaktu = filterTipe === 'Bulanan'
            ? d.getMonth() === parseInt(bulanLaporan) && d.getFullYear() === parseInt(tahunLaporan)
            : d.getFullYear() === parseInt(tahunLaporan);
        return matchKelas && matchWaktu;
    });

    const handleExportRekap = () => {
        const dataExport = filteredLaporan.map(l => {
            const student = users.find(u => u.uid === l.student_uid);
            return { ID: l.report_id, Siswa: student?.nama_lengkap || 'Unknown', Kelas: student?.kelas || '-', Judul: l.judul_buku, Tanggal: l.tanggal_kirim, Status: l.status };
        });
        const csvContent = "data:text/csv;charset=utf-8," + Object.keys(dataExport[0]).join(",") + "\n" + dataExport.map(row => Object.values(row).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "rekap_laporan.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const totalVerified = laporan.filter(r => r.status === 'Disetujui').length;
    const totalPending = laporan.filter(r => r.status === 'Menunggu').length;
    const classData = dataKelas.map(k => ({ label: k.nama, value: laporan.filter(l => users.find(u => u.uid === l.student_uid)?.kelas === k.nama).length }));
    const progressData = NAMA_BULAN.map((label, index) => ({ label: label.substring(0, 3), value: laporan.filter(l => new Date(l.tanggal_kirim).getMonth() === index && new Date(l.tanggal_kirim).getFullYear() === currentYear).length }));

    const renderContent = () => {
        const now = new Date();
        const displayTahunAjaran = dataSekolah.tahun_ajaran || `${now.getFullYear()}/${now.getFullYear() + 1}`;

        switch (currentView) {
            case 'sekolah': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><School size={120} className="text-rose-600" /></div>
                    <div className="flex justify-between items-center mb-8 relative z-10">
                        <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                            <div className="p-3 bg-rose-100 rounded-xl text-rose-600 shadow-sm"><School size={24} /></div> Data Sekolah
                        </h2>
                        {!editingId && <button onClick={() => setEditingId('sekolah')} className="glass-button flex items-center gap-2 px-6 py-2.5 text-rose-600 rounded-xl font-bold hover:bg-rose-50"><Edit size={18} /> Edit Data</button>}
                    </div>
                    {editingId === 'sekolah' ? (
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.target);
                            onUpdateSekolah({ ...dataSekolah, nama: formData.get('nama'), akreditasi: formData.get('akreditasi'), alamat: formData.get('alamat'), kepala_sekolah: formData.get('kepala_sekolah'), tahun_ajaran: formData.get('tahun_ajaran'), nip_kepala_sekolah: formData.get('nip_kepala_sekolah'), kota: formData.get('kota') });
                            setEditingId(null);
                        }} className="space-y-6 max-w-2xl relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Nama Sekolah</label><input name="nama" defaultValue={dataSekolah.nama} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Akreditasi</label><select name="akreditasi" defaultValue={dataSekolah.akreditasi} className="w-full p-3 border border-gray-200 rounded-xl outline-none"><option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="Belum Terakreditasi">Belum</option></select></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Alamat</label><input name="alamat" defaultValue={dataSekolah.alamat} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Tahun Pelajaran</label><input name="tahun_ajaran" defaultValue={dataSekolah.tahun_ajaran} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Kepala Sekolah</label><input name="kepala_sekolah" defaultValue={dataSekolah.kepala_sekolah} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">NIP Kepala Sekolah</label><input name="nip_kepala_sekolah" defaultValue={dataSekolah.nip_kepala_sekolah} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                                <div className="space-y-2"><label className="text-sm font-bold text-gray-600">Kota</label><input name="kota" defaultValue={dataSekolah.kota} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                            </div>
                            <div className="flex gap-3 pt-4"><button className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold">Simpan</button><button type="button" onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-600 px-6 py-2.5 rounded-xl font-bold">Batal</button></div>
                        </form>
                    ) : (

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
                            <div className="p-6 bg-white/40 rounded-2xl border border-white/60 hover:shadow-lg transition-all flex items-start gap-4 group">
                                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl group-hover:scale-110 transition-transform"><School size={24} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Nama Sekolah</label><p className="font-bold text-xl text-gray-800">{dataSekolah.nama}</p></div>
                            </div >
                            <div className="p-6 bg-white/40 rounded-2xl border border-white/60 hover:shadow-lg transition-all flex items-start gap-4 group">
                                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl group-hover:scale-110 transition-transform"><MapPin size={24} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Alamat & Kota</label><p className="font-medium text-gray-800">{dataSekolah.alamat}</p><p className="text-sm text-gray-500">{dataSekolah.kota || '-'}</p></div>
                            </div>
                            <div className="p-6 bg-white/40 rounded-2xl border border-white/60 hover:shadow-lg transition-all flex items-start gap-4 group">
                                <div className="p-3 bg-indigo-100 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform"><User size={24} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Kepala Sekolah</label><p className="font-medium text-gray-800">{dataSekolah.kepala_sekolah}</p><p className="text-xs text-gray-500 font-mono mt-1">NIP: {dataSekolah.nip_kepala_sekolah || '-'}</p></div>
                            </div>
                            <div className="p-6 bg-white/40 rounded-2xl border border-white/60 hover:shadow-lg transition-all flex items-start gap-4 group">
                                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform"><Award size={24} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Akreditasi</label><p className="font-bold text-xl text-gray-800">{dataSekolah.akreditasi || '-'}</p></div>
                            </div>
                            <div className="p-6 bg-white/40 rounded-2xl border border-white/60 hover:shadow-lg transition-all flex items-start gap-4 group">
                                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl group-hover:scale-110 transition-transform"><Calendar size={24} /></div>
                                <div><label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tahun Pelajaran</label><p className="font-bold text-xl text-gray-800">{dataSekolah.tahun_ajaran || '-'}</p></div>
                            </div>
                        </div >
                    )}
                </div >
            );
            case 'kelas': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><Layout size={120} className="text-cyan-600" /></div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10"><div className="p-3 bg-cyan-100 rounded-xl text-cyan-600 shadow-sm"><Layout size={24} /></div> Data Kelas</h2>
                    <form onSubmit={handleSimpanKelas} className="mb-8 glass-panel p-6 rounded-2xl flex gap-4 items-end flex-wrap relative z-10">
                        <div className="w-48"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nama Kelas</label><input value={formKelas.nama} onChange={e => setFormKelas({ ...formKelas, nama: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl outline-none" placeholder="Ex: 1A" /></div>
                        <div className="flex-1 min-w-[200px]"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Tahun Pelajaran</label><input value={formKelas.tahun_pelajaran} onChange={e => setFormKelas({ ...formKelas, tahun_pelajaran: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl outline-none" placeholder="2024/2025" /></div>
                        <button type="submit" className="bg-cyan-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-cyan-700 flex items-center gap-2">{editingId?.startsWith('K') ? 'Update' : 'Tambah'}</button>
                        {editingId?.startsWith('K') && <button type="button" onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold">Batal</button>}
                    </form>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {dataKelas.map((kelas, index) => {
                            const colors = ['cyan', 'rose', 'amber', 'emerald', 'violet', 'blue'];
                            const theme = THEME_COLORS[colors[index % colors.length]];
                            return (
                                <div key={kelas.id} className={`p-5 rounded-3xl bg-white/40 backdrop-blur-xl border border-white/60 hover:shadow-2xl hover:shadow-${theme.text}/20 transition-all duration-500 relative group overflow-hidden`}>
                                    <div className={`absolute inset-0 bg-gradient-to-br ${theme.bg} to-transparent opacity-30 group-hover:opacity-50 transition-opacity duration-500`}></div>
                                    <div className={`absolute -right-12 -top-12 w-32 h-32 ${theme.bg} rounded-full blur-3xl opacity-40 group-hover:scale-150 transition-transform duration-700`}></div>

                                    <div className="flex justify-between items-start mb-4 relative z-10">
                                        <div className={`p-3 bg-white/80 backdrop-blur-md rounded-2xl shadow-sm ${theme.text} group-hover:scale-110 transition-transform duration-300`}><Layout size={24} /></div>
                                        <div className="text-center">
                                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-1">KELAS</span>
                                            <h3 className={`text-4xl font-black ${theme.dark} tracking-tight drop-shadow-sm`}>{kelas.nama}</h3>
                                        </div>
                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                            <button onClick={() => { setEditingId(kelas.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 bg-white text-blue-600 rounded-xl shadow-sm hover:bg-blue-50 hover:scale-110 transition-all"><Edit size={16} /></button>
                                            <button onClick={() => { setItemToDelete({ type: 'kelas', id: kelas.id }); setIsModalOpen(true); }} className="p-2 bg-white text-red-600 rounded-xl shadow-sm hover:bg-red-50 hover:scale-110 transition-all"><Trash2 size={16} /></button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 relative z-10">
                                        <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:bg-white/80 transition-colors">
                                            <div className="flex items-center gap-2 text-gray-600 font-bold text-sm"><Users size={16} className={`${theme.text}`} /> Siswa</div>
                                            <span className={`h-7 px-3 flex items-center justify-center rounded-full font-bold text-xs ${theme.bg} ${theme.dark} shadow-inner`}>{users.filter(u => u.role === 'murid' && u.kelas === kelas.nama).length}</span>
                                        </div>
                                        <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm hover:bg-white/80 transition-colors">
                                            <div className="flex items-center gap-2 text-gray-600 font-bold text-sm"><BookOpen size={16} className={`${theme.text}`} /> Tahun</div>
                                            <span className="font-bold text-gray-800 font-mono text-sm">{kelas.tahun_pelajaran || '-'}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
            case 'siswa': return (
                <div className="space-y-6 animate-fade-in">
                    <div className="glass-card rounded-2xl p-8">
                        <h3 className="font-bold text-xl mb-6 text-gray-800 flex items-center gap-2">{editingId?.startsWith('S') ? 'Edit Siswa' : 'Tambah Siswa'}</h3>
                        <form onSubmit={handleSimpanSiswa} className="flex gap-4 items-end flex-wrap">
                            <div className="flex-1 min-w-[200px]"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Nama</label><input value={formSiswa.nama} onChange={e => setFormSiswa({ ...formSiswa, nama: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                            <div className="w-40"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Kelas</label><select value={formSiswa.kelas} onChange={e => setFormSiswa({ ...formSiswa, kelas: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl outline-none">{dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}</select></div>
                            <div className="w-40"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Username</label><input value={formSiswa.username} onChange={e => setFormSiswa({ ...formSiswa, username: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                            <div className="w-32"><label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Password</label><input value={formSiswa.password} onChange={e => setFormSiswa({ ...formSiswa, password: e.target.value })} className="w-full p-3 border border-gray-200 rounded-xl outline-none" /></div>
                            <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">Simpan</button>
                            {editingId?.startsWith('S') && <button type="button" onClick={() => setEditingId(null)} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold">Batal</button>}
                        </form>
                    </div>
                    <div className="glass-card rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/30 backdrop-blur-sm">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-gray-800"><Users className="text-blue-600" /> Data Siswa</h2>
                            <select value={filterKelasSiswa} onChange={e => setFilterKelasSiswa(e.target.value)} className="p-2 border border-gray-200 rounded-lg text-sm"><option value="all">Semua Kelas</option>{dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}</select>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs"><tr><th className="p-4">UID</th><th className="p-4">Nama</th><th className="p-4">Username</th><th className="p-4">Kelas</th><th className="p-4">Poin</th><th className="p-4 text-right">Aksi</th></tr></thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {users.filter(u => u.role === 'murid' && (filterKelasSiswa === 'all' || u.kelas === filterKelasSiswa)).map(siswa => (
                                        <tr key={siswa.uid} className="hover:bg-blue-50/30">
                                            <td className="p-4 text-gray-500 font-mono text-xs">{siswa.uid}</td>
                                            <td className="p-4 font-bold text-gray-700">{siswa.nama_lengkap}</td>
                                            <td className="p-4"><span className="text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-lg">{siswa.username}</span></td>
                                            <td className="p-4 text-gray-600">{siswa.kelas}</td>
                                            <td className="p-4 text-gray-600 font-bold">{siswa.total_poin}</td>
                                            <td className="p-4 text-right flex justify-end gap-2">
                                                <button onClick={() => { setEditingId(siswa.uid); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"><Edit size={18} /></button>
                                                <button onClick={() => { setItemToDelete({ type: 'siswa', id: siswa.uid }); setIsModalOpen(true); }} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={18} /></button>
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
                    {/* Print Styles */}
                    <style>{`
                        @media print {
                            @page {
                                size: A4 landscape;
                                margin: 1.5cm;
                            }
                            body, html, #root {
                                height: auto !important;
                                overflow: visible !important;
                            }
                            /* Reset main layout containers */
                            .h-screen {
                                height: auto !important;
                                overflow: visible !important;
                            }
                            .overflow-y-auto {
                                overflow: visible !important;
                                height: auto !important;
                            }
                            .overflow-hidden {
                                overflow: visible !important;
                            }
                            .no-print {
                                display: none !important;
                            }
                            .print-only {
                                display: block !important;
                            }
                            .glass-card {
                                box-shadow: none !important;
                                border: none !important;
                                background: white !important;
                                padding: 0 !important;
                                margin: 0 !important;
                                overflow: visible !important;
                            }
                            .overflow-x-auto {
                                overflow: visible !important;
                            }
                            table {
                                width: 100% !important;
                                border-collapse: collapse !important;
                                table-layout: fixed !important; /* Ensure table respects width */
                            }
                            th, td {
                                border: 1px solid black !important;
                                padding: 8px !important;
                                font-size: 12px !important; /* Increased font size for landscape */
                                color: black !important;
                                word-wrap: break-word !important; /* Force word wrap */
                                white-space: normal !important; /* Allow wrapping */
                            }
                            thead {
                                display: table-header-group;
                            }
                            tr {
                                page-break-inside: avoid;
                            }
                            .signature-block {
                                page-break-inside: avoid;
                                margin-top: 30px;
                                color: black !important;
                                display: block !important;
                                visibility: visible !important;
                            }
                            /* Hide the original header row border to avoid double borders with the title row */
                            thead tr:first-child th {
                                border: none !important;
                            }
                        }
                    `}</style>

                    <div className="glass-card rounded-2xl p-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5 no-print"><FileText size={120} className="text-violet-600" /></div>
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10 no-print">
                            <div className="p-3 bg-violet-100 rounded-xl text-violet-600 shadow-sm"><FileText size={24} /></div> Rekap Laporan
                        </h2>

                        <div className="flex flex-wrap gap-4 mb-8 items-end relative z-10 no-print">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tipe Laporan</label>
                                <select value={filterTipe} onChange={e => setFilterTipe(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[150px] outline-none"><option value="Bulanan">Bulanan</option><option value="Tahunan">Tahunan</option></select>
                            </div>
                            {filterTipe === 'Bulanan' && (
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bulan</label>
                                    <select value={bulanLaporan} onChange={e => setBulanLaporan(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[150px] outline-none">{Array.from({ length: 12 }, (_, i) => <option key={i} value={i}>{new Date(0, i).toLocaleDateString('id-ID', { month: 'long' })}</option>)}</select>
                                </div>
                            )}
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tahun</label>
                                <select value={tahunLaporan} onChange={e => setTahunLaporan(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[100px] outline-none">{Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}</select>
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Filter Kelas</label>
                                <select value={filterKelas} onChange={e => setFilterKelas(e.target.value)} className="p-3 border border-gray-200 rounded-xl min-w-[150px] outline-none"><option value="all">Semua Kelas</option>{dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}</select>
                            </div>
                            <div className="flex-1"></div>
                            <div className="flex gap-3">
                                <button onClick={handleExportRekap} className="flex items-center gap-2 px-5 py-3 bg-green-100 text-green-700 rounded-xl font-bold hover:bg-green-200"><Download size={18} /> Export Excel</button>
                                <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200"><Printer size={18} /> Cetak PDF</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-xl border border-gray-100/50 relative z-10">
                            <table className="w-full text-left text-sm border-collapse min-w-[600px]">
                                <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs">
                                    {/* Title Row for Print - Inside thead to repeat on pages */}
                                    <tr className="hidden print:table-row border-none">
                                        <th colSpan="7" className="p-4 text-center border-none">
                                            <h1 className="text-2xl font-bold uppercase mb-1 text-black">Laporan Literasi {filterTipe}</h1>
                                            <p className="text-lg font-normal text-black">Periode: {filterTipe === 'Bulanan' ? new Date(tahunLaporan, bulanLaporan).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : tahunLaporan}</p>
                                            <p className="text-sm font-normal text-black mt-1">{dataSekolah.nama}</p>
                                        </th>
                                    </tr>
                                    <tr className="border-b border-gray-100">
                                        <th className="p-4 w-10">No</th>
                                        <th className="p-4 w-24">Tanggal</th>
                                        <th className="p-4 w-32">Siswa</th>
                                        <th className="p-4 w-16">Kelas</th>
                                        <th className="p-4 w-40">Judul Buku</th>
                                        <th className="p-4">Ringkasan</th>
                                        <th className="p-4 w-24">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    {filteredLaporan.length > 0 ? filteredLaporan.map((l, idx) => {
                                        const student = users.find(u => u.uid === l.student_uid);
                                        const dateObj = new Date(l.tanggal_kirim);
                                        const formattedDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;

                                        return (
                                            <tr key={idx} className="hover:bg-violet-50/30">
                                                <td className="p-4 text-gray-500 font-medium text-center align-top">{idx + 1}</td>
                                                <td className="p-4 text-gray-600 font-medium whitespace-nowrap align-top">{formattedDate}</td>
                                                <td className="p-4 font-bold text-gray-800 align-top">{student?.nama_lengkap}</td>
                                                <td className="p-4 text-center text-gray-500 whitespace-nowrap align-top">{student?.kelas}</td>
                                                <td className="p-4 text-gray-700 font-medium align-top">{l.judul_buku}</td>
                                                <td className="p-4 text-gray-600 text-xs align-top">
                                                    <div className="line-clamp-2 print:line-clamp-none print:block print:overflow-visible">
                                                        {l.ringkasan}
                                                    </div>
                                                </td>
                                                <td className="p-4 whitespace-nowrap align-top"><span className={`px-3 py-1 rounded-full text-xs font-bold ${l.status === 'Disetujui' ? 'bg-green-100 text-green-700' : l.status === 'Ditolak' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'} print:bg-transparent print:text-black print:border print:border-black`}>{l.status}</span></td>
                                            </tr>
                                        )
                                    }) : <tr><td colSpan="7" className="p-12 text-center text-gray-400 font-medium">Tidak ada data.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="print-only mt-12 pt-8 signature-block">
                        <div className="flex justify-between">
                            <div className="text-center">
                                <p className="mb-20">Mengetahui,<br />Kepala Sekolah</p>
                                <p className="font-bold underline">{dataSekolah.kepala_sekolah || '.........................'}</p>
                                <p>NIP. {dataSekolah.nip_kepala_sekolah || '.........................'}</p>
                            </div>
                            <div className="text-center">
                                <p className="mb-20">{dataSekolah.kota ? `${dataSekolah.kota}, ` : ''}{new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}<br />Guru</p>
                                <p className="font-bold underline">{currentUser.nama_lengkap}</p>
                                <p>NIP. {currentUser.nip || '.........................'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            );
            case 'leaderboard':
                const filteredUsers = users.filter(u => u.role === 'murid' && (filterKelasLeaderboard === 'all' || u.kelas === filterKelasLeaderboard))
                    .sort((a, b) => b.total_poin - a.total_poin);
                const topThree = filteredUsers.slice(0, 3);
                const restUsers = filteredUsers.slice(3);

                const getRankIcon = (index) => {
                    switch (index) {
                        case 0: return <Crown className="text-yellow-500 fill-current animate-bounce-slow" size={32} />;
                        case 1: return <Medal className="text-gray-400 fill-current" size={28} />;
                        case 2: return <Medal className="text-orange-400 fill-current" size={28} />;
                        default: return <span className="font-bold text-gray-500">#{index + 1}</span>;
                    }
                };

                return (
                    <div className="glass-card rounded-2xl p-8 animate-fade-in relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5"><Trophy size={120} className="text-amber-600" /></div>
                        <div className="flex justify-between items-center mb-8 relative z-10">
                            <h2 className="text-3xl font-bold flex items-center gap-3 text-gray-800">
                                <div className="p-3 bg-amber-100 rounded-xl text-amber-600 shadow-sm"><Trophy size={24} /></div> Hall of Fame
                            </h2>
                            <select value={filterKelasLeaderboard} onChange={e => setFilterKelasLeaderboard(e.target.value)} className="p-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 outline-none focus:ring-2 focus:ring-amber-200 bg-white/50 backdrop-blur-sm">
                                <option value="all">Semua Kelas</option>
                                {dataKelas.map(k => <option key={k.id} value={k.nama}>{k.nama}</option>)}
                            </select>
                        </div>

                        <div className="relative z-10">
                            {filteredUsers.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <AlertCircle className="text-gray-400" size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700">Belum Ada Data</h3>
                                    <p className="text-gray-500 max-w-xs mx-auto">Belum ada siswa yang masuk dalam papan peringkat saat ini.</p>
                                </div>
                            ) : (
                                <>
                                    {/* Top 3 Podium */}
                                    <div className="flex justify-center items-end gap-3 mb-12 mt-6 min-h-[220px]">
                                        {/* 2nd Place */}
                                        {topThree[1] ? (
                                            <div className="flex flex-col items-center w-1/3 group">
                                                <div className="w-20 h-20 rounded-full border-4 border-gray-300 overflow-hidden shadow-lg mb-2 relative ring-4 ring-gray-50 group-hover:scale-105 transition-transform z-10">
                                                    <img src={topThree[1].foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}&mouth=smile&eyebrows=default&eyes=happy`} alt={topThree[1].nama_lengkap} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 right-0 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white z-20">2</div>
                                                </div>
                                                <p className="font-bold text-sm text-center line-clamp-1 text-gray-800">{topThree[1].nama_lengkap}</p>
                                                <p className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full mt-1">{topThree[1].total_poin} Poin</p>
                                                <div className="h-24 w-full bg-gradient-to-t from-gray-300 to-gray-100 rounded-t-2xl mt-2 shadow-inner opacity-80 relative flex justify-center pt-2">
                                                    <span className="text-4xl font-black text-gray-400/30">2</span>
                                                </div>
                                            </div>
                                        ) : <div className="w-1/3"></div>}

                                        {/* 1st Place */}
                                        {topThree[0] ? (
                                            <div className="flex flex-col items-center w-1/3 -mt-8 z-10 group">
                                                <div className="absolute -mt-14 animate-bounce-slow">{getRankIcon(0)}</div>
                                                <div className="w-28 h-28 rounded-full border-4 border-yellow-400 overflow-hidden shadow-xl mb-2 relative ring-4 ring-yellow-100 group-hover:scale-105 transition-transform z-10">
                                                    <img src={topThree[0].foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}&mouth=smile&eyebrows=default&eyes=happy`} alt={topThree[0].nama_lengkap} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full border-2 border-white z-20">1</div>
                                                </div>
                                                <p className="font-bold text-base text-center line-clamp-1 text-indigo-900">{topThree[0].nama_lengkap}</p>
                                                <p className="text-xs text-yellow-700 font-bold bg-yellow-100 px-3 py-0.5 rounded-full mt-1">{topThree[0].total_poin} Poin</p>
                                                <div className="h-40 w-full bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-t-2xl mt-2 shadow-lg relative overflow-hidden flex justify-center pt-4">
                                                    <span className="text-6xl font-black text-yellow-500/20 relative z-10">1</span>
                                                    <div className="absolute inset-0 bg-white/30 skew-y-12 transform translate-y-10"></div>
                                                    <div className="absolute bottom-4 left-0 right-0 text-center">
                                                        <Star className="w-8 h-8 text-yellow-500 fill-current inline-block animate-pulse" />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : <div className="w-1/3"></div>}

                                        {/* 3rd Place */}
                                        {topThree[2] ? (
                                            <div className="flex flex-col items-center w-1/3 group">
                                                <div className="w-20 h-20 rounded-full border-4 border-orange-300 overflow-hidden shadow-lg mb-2 relative ring-4 ring-orange-50 group-hover:scale-105 transition-transform z-10">
                                                    <img src={topThree[2].foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}&mouth=smile&eyebrows=default&eyes=happy`} alt={topThree[2].nama_lengkap} className="w-full h-full object-cover" />
                                                    <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white z-20">3</div>
                                                </div>
                                                <p className="font-bold text-sm text-center line-clamp-1 text-gray-800">{topThree[2].nama_lengkap}</p>
                                                <p className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full mt-1">{topThree[2].total_poin} Poin</p>
                                                <div className="h-20 w-full bg-gradient-to-t from-orange-300 to-orange-100 rounded-t-2xl mt-2 shadow-inner opacity-80 relative flex justify-center pt-2">
                                                    <span className="text-4xl font-black text-orange-400/30">3</span>
                                                </div>
                                            </div>
                                        ) : <div className="w-1/3"></div>}
                                    </div>

                                    {/* Full List */}
                                    <div className="space-y-3">
                                        <h3 className="font-bold text-gray-700 mb-4 px-2">Peringkat Keseluruhan</h3>
                                        {filteredUsers.map((u, index) => {
                                            const isTop3 = index < 3;
                                            const theme = isTop3 ? { bg: 'bg-yellow-50', border: 'border-yellow-200' } : { bg: 'bg-white', border: 'border-gray-100' };

                                            return (
                                                <div key={u.uid} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.01] hover:shadow-md ${theme.bg} ${theme.border}`}>
                                                    <div className={`font-bold w-8 text-center text-lg ${index < 3 ? 'text-yellow-500' : 'text-gray-400 italic'}`}>
                                                        {index < 3 ? <Trophy size={20} className="mx-auto" /> : `#${index + 1}`}
                                                    </div>
                                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                                                        <img src={u.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}&mouth=smile&eyebrows=default&eyes=happy`} alt={u.nama_lengkap} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="font-bold text-base text-gray-800">{u.nama_lengkap}</h4>
                                                        <div className="flex items-center gap-2 mt-0.5">
                                                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">Kelas {u.kelas}</span>
                                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                            <span className="text-xs font-bold text-indigo-600">{u.total_poin} Poin</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );
            case 'profil': return (
                <div className="glass-card rounded-2xl p-8 animate-fade-in max-w-2xl mx-auto relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5"><User size={120} className="text-indigo-600" /></div>
                    <h2 className="text-3xl font-bold mb-8 flex items-center gap-3 text-gray-800 relative z-10"><div className="p-3 bg-indigo-100 rounded-xl text-indigo-600 shadow-sm"><User size={24} /></div> Profil Guru</h2>
                    <form onSubmit={handleUpdateProfilGuru} className="space-y-6 relative z-10">
                        <div className="flex items-center gap-8 mb-8">
                            <div className="w-28 h-28 rounded-full bg-gray-200 border-4 border-white shadow-xl overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
                                <img src={currentUser.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"><Camera className="text-white" size={32} /></div>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handlePhotoChange} className="hidden" accept="image/*" />
                            <div><h3 className="font-bold text-2xl text-gray-800">{currentUser.nama_lengkap}</h3><p className="text-indigo-600 font-medium">Guru Pengajar</p></div>
                        </div>
                        <div className="space-y-4">
                            <div><label className="text-sm font-bold text-gray-600 block mb-2">Nama Lengkap</label><input name="nama" defaultValue={currentUser.nama_lengkap} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required /></div>
                            <div><label className="text-sm font-bold text-gray-600 block mb-2">Username Login</label><input name="username" defaultValue={currentUser.username} className="w-full p-3 border border-gray-200 rounded-xl outline-none" required /></div>
                            <div><label className="text-sm font-bold text-gray-600 block mb-2">NIP</label><input name="nip" defaultValue={currentUser.nip} className="w-full p-3 border border-gray-200 rounded-xl outline-none" placeholder="NIP Anda" /></div>
                            <div><label className="text-sm font-bold text-gray-600 block mb-2">Password</label><div className="relative"><input name="password" type="text" defaultValue={currentUser.password} className="w-full p-3 border border-gray-200 rounded-xl pr-10 outline-none" required /><Lock className="absolute right-3 top-3.5 text-gray-400" size={18} /></div></div>
                        </div>
                        <button type="submit" className="w-full py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 transform active:scale-95 mt-4">Simpan Perubahan</button>
                    </form>
                </div>
            );
            case 'verifikasi': return (
                <div className="glass-card rounded-2xl overflow-hidden animate-fade-in">
                    <div className="p-6 border-b border-gray-100/50 flex justify-between items-center bg-white/30 backdrop-blur-sm">
                        <h3 className="font-bold text-xl text-gray-800 flex items-center gap-2"><div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><CheckCircle size={20} /></div> Verifikasi Laporan</h3>
                        <span className="text-xs font-bold bg-orange-100 text-orange-600 px-4 py-1.5 rounded-full shadow-sm">{laporan.filter(r => r.status === 'Menunggu').length} Menunggu</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs"><tr><th className="p-4">Siswa</th><th className="p-4">Judul Buku</th><th className="p-4">Ringkasan</th><th className="p-4">Tanggal</th><th className="p-4 text-right">Aksi</th></tr></thead>
                            <tbody className="divide-y divide-gray-100/50">
                                {laporan.filter(r => r.status === 'Menunggu').length === 0 ? (
                                    <tr><td colSpan="5" className="p-12 text-center text-gray-400 font-medium flex flex-col items-center gap-2"><CheckCircle size={48} className="text-emerald-200" />Tidak ada laporan yang perlu diverifikasi.</td></tr>
                                ) : (
                                    laporan.filter(r => r.status === 'Menunggu').map(lap => (
                                        <tr key={lap.report_id} className="hover:bg-emerald-50/30">
                                            <td className="p-4 font-bold text-gray-800">{users.find(u => u.uid === lap.student_uid)?.nama_lengkap || 'Unknown'}<div className="text-xs text-gray-400 font-normal mt-0.5">{users.find(u => u.uid === lap.student_uid)?.kelas}</div></td>
                                            <td className="p-4 text-gray-700 font-medium">{lap.judul_buku}</td>
                                            <td className="p-4 text-gray-500 max-w-xs truncate">{lap.ringkasan}</td>
                                            <td className="p-4 text-gray-500">{lap.tanggal_kirim}</td>
                                            <td className="p-4 text-right">
                                                <div className="flex flex-col gap-2">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => {
                                                            if (rejectingId === lap.report_id) {
                                                                // If already open, approve with note
                                                                onVerify(lap.report_id, true, rejectionNote);
                                                                setRejectingId(null);
                                                            } else {
                                                                // Open note input
                                                                setRejectingId(lap.report_id);
                                                                setRejectionNote(lap.feedback_guru || '');
                                                            }
                                                        }} className={`p-2 rounded-lg transition-colors ${rejectingId === lap.report_id ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-green-100 text-green-600 hover:bg-green-200'}`} title={rejectingId === lap.report_id ? "Kirim Penilaian" : "Beri Nilai"}>
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        {rejectingId !== lap.report_id && (
                                                            <button onClick={() => { setRejectingId(lap.report_id); setRejectionNote(''); }} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200" title="Tulis Catatan">
                                                                <Edit className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                    {rejectingId === lap.report_id && (
                                                        <div className="mt-2 p-3 bg-white rounded-xl border border-indigo-100 shadow-lg animate-fade-in text-left relative z-20 w-64 ml-auto">
                                                            <label className="text-xs font-bold text-gray-500 mb-1 block">Catatan untuk Siswa (Opsional):</label>
                                                            <textarea value={rejectionNote} onChange={(e) => setRejectionNote(e.target.value)} placeholder="Berikan semangat atau masukan..." className="w-full p-2 border border-gray-200 rounded-lg text-sm outline-none mb-2 bg-gray-50 focus:bg-white transition-colors" rows="3" />
                                                            <div className="flex gap-2 justify-end">
                                                                <button onClick={() => setRejectingId(null)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Batal</button>
                                                                <button onClick={() => { onVerify(lap.report_id, false, rejectionNote); setRejectingId(null); }} className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-600 hover:bg-red-200 rounded-lg">Tolak</button>
                                                                <button onClick={() => { onVerify(lap.report_id, true, rejectionNote); setRejectingId(null); }} className="px-3 py-1.5 text-xs font-bold bg-green-600 text-white hover:bg-green-700 rounded-lg shadow-sm">Setujui</button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { label: 'Total Siswa', value: totalStudents, icon: Users, color: 'blue' },
                                { label: 'Sudah Diverifikasi', value: totalVerified, icon: CheckCircle, color: 'green' },
                                { label: 'Belum Diverifikasi', value: totalPending, icon: AlertCircle, color: 'orange' },
                                { label: 'Total Laporan', value: laporan.length, icon: BookOpen, color: 'purple' }
                            ].map((stat, idx) => {
                                const theme = THEME_COLORS[stat.color];
                                return (
                                    <div key={idx} className="glass-card p-6 rounded-2xl flex items-center gap-5 hover:transform hover:-translate-y-1 transition-all group">
                                        <div className={`p-4 rounded-2xl ${theme.bg} ${theme.text} shadow-sm group-hover:scale-110 transition-transform`}><stat.icon className="w-8 h-8" /></div>
                                        <div><p className="text-gray-500 text-sm font-bold mb-1">{stat.label}</p><h3 className="text-3xl font-extrabold text-gray-800">{stat.value}</h3></div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-96">
                            <SimpleBarChart data={classData} title={`Minat Baca per Kelas (${displayTahunAjaran})`} color="bg-indigo-500" />
                            <SimpleBarChart data={progressData} title={`Progress Membaca Bulanan (${displayTahunAjaran})`} colors={['bg-rose-300', 'bg-orange-300', 'bg-amber-300', 'bg-emerald-300', 'bg-teal-300', 'bg-cyan-300', 'bg-sky-300', 'bg-indigo-300', 'bg-violet-300', 'bg-purple-300', 'bg-fuchsia-300', 'bg-pink-300']} />
                        </div>
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
                                ].map((item) => {
                                    const theme = THEME_COLORS[item.color];
                                    return (
                                        <button key={item.id} onClick={() => setView(item.id)} className={`p-5 rounded-2xl ${theme.soft} ${theme.hover} ${theme.dark} transition-all transform hover:-translate-y-2 hover:shadow-lg flex flex-col items-center gap-3 group border ${theme.border} relative overflow-hidden`}>
                                            <div className={`absolute top-0 right-0 p-8 ${theme.icon} rounded-bl-full opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                                            <div className={`p-3.5 ${theme.icon} rounded-xl ${theme.dark} group-hover:scale-110 transition-transform shadow-sm relative z-10`}><item.icon size={28} /></div>
                                            <span className="font-bold text-sm relative z-10">{item.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-orbit" style={{ animationDuration: '25s' }}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-orbit" style={{ animationDuration: '30s', animationDirection: 'reverse' }}></div>
                <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-float"></div>
            </div>
            <ModalKonfirmasi isOpen={isModalOpen} pesan={itemToDelete?.type === 'kelas' ? "Hapus kelas ini?" : "Hapus siswa ini?"} onConfirm={confirmHapus} onCancel={() => setIsModalOpen(false)} />
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
