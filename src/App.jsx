import React, { useState } from 'react';
import {
  BookOpen, User, GraduationCap, Loader, ChevronRight, Lock,
  BarChart2, CheckCircle, FileText, Trophy, School, Layout, Users, Settings, LogOut,
  Home, PlusCircle, AlertCircle, BadgeCheck
} from 'lucide-react';
import {
  PENGGUNA_AWAL, LAPORAN_AWAL, DATA_SEKOLAH_AWAL, DATA_KELAS_AWAL, hitungLevel
} from './data/mockData';
import Footer from './components/common/Footer';
import BerandaSiswa from './components/student/BerandaSiswa';
import PustakaSiswa from './components/student/PustakaSiswa';
import StudentInput from './components/student/StudentInput';
import StudentProfile from './components/student/StudentProfile';
import DashboardGuru from './components/teacher/DashboardGuru';
import StudentLeaderboard from './components/student/StudentLeaderboard';
import TeacherLayout from './components/teacher/TeacherLayout';

import { api } from './services/api';

export default function LenteraApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [laporan, setLaporan] = useState([]);
  const [dataSekolah, setDataSekolah] = useState({});
  const [dataKelas, setDataKelas] = useState([]);
  const [peranLogin, setPeranLogin] = useState('murid');
  const [formLogin, setFormLogin] = useState({ username: '', password: '' });
  const [sedangMemuat, setSedangMemuat] = useState(true); // Default true for initial load
  const [tabSiswa, setTabSiswa] = useState('home');
  const [viewGuru, setViewGuru] = useState('dashboard');
  const [notifikasi, setNotifikasi] = useState(null);
  const [tipeNotifikasi, setTipeNotifikasi] = useState('success');

  // Fetch Initial Data
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersData, laporanData, sekolahData, kelasData] = await Promise.all([
          api.getUsers(),
          api.getLaporan(),
          api.getSekolah(),
          api.getKelas()
        ]);

        if (usersData.status === 'success') setUsers(usersData.data);
        if (laporanData.status === 'success') setLaporan(laporanData.data);
        if (sekolahData.status === 'success' && Array.isArray(sekolahData.data) && sekolahData.data.length > 0) {
          setDataSekolah(sekolahData.data[0]);
        }
        if (kelasData.status === 'success') setDataKelas(kelasData.data || []);

      } catch (error) {
        console.error("Failed to fetch data", error);
        triggerNotifikasi("Gagal memuat data dari database", "error");
      } finally {
        setSedangMemuat(false);
      }
    };

    fetchData();
  }, []);

  // Session Persistence
  React.useEffect(() => {
    const savedUser = localStorage.getItem('lentera_user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setCurrentUser(parsedUser);
        setPeranLogin(parsedUser.role === 'guru' ? 'guru' : 'murid');
      } catch (e) {
        console.error("Failed to parse saved user", e);
        localStorage.removeItem('lentera_user');
      }
    }
  }, []);

  const [editingReport, setEditingReport] = useState(null);

  const triggerNotifikasi = (msg, tipe = 'success') => { setNotifikasi(msg); setTipeNotifikasi(tipe); setTimeout(() => setNotifikasi(null), 3000); };

  const tanganiLogin = (e) => {
    e.preventDefault();
    setSedangMemuat(true);
    setTimeout(() => {
      // Use String() comparison to handle number vs string password types from DB
      const user = users.find(u =>
        u.username === formLogin.username &&
        String(u.password) === String(formLogin.password) &&
        u.role === peranLogin
      );

      if (user) {
        setCurrentUser(user);
        localStorage.setItem('lentera_user', JSON.stringify(user));
        triggerNotifikasi(`Selamat datang, ${user.nama_lengkap}!`, 'success');
        setFormLogin({ username: '', password: '' });
      } else {
        triggerNotifikasi("Login Gagal! Username atau password salah.", 'error');
      }
      setSedangMemuat(false);
    }, 1000);
  };

  const tanganiLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('lentera_user');
    setTabSiswa('home');
    setViewGuru('dashboard');
    setFormLogin({ username: '', password: '' });
  };

  const tanganiKirimLaporan = async (data) => {
    const laporanBaru = {
      report_id: `R${Date.now()}`, // Use timestamp for unique ID
      student_uid: currentUser.uid,
      nama_siswa: currentUser.nama_lengkap, // Cache name
      kelas: currentUser.kelas, // Cache class
      judul_buku: data.judul,
      kategori: data.kategori || 'Umum',
      ringkasan: data.ringkasan,
      tanggal_kirim: new Date().toISOString().split('T')[0],
      status: "Menunggu",
      feedback_guru: "",
      foto_bukti: ""
    };

    // Optimistic Update
    setLaporan([laporanBaru, ...laporan]);
    setTabSiswa('home');
    triggerNotifikasi("Laporan terkirim! Menunggu verifikasi guru.", 'success');

    // API Call
    try {
      await api.addLaporan(laporanBaru);
    } catch (error) {
      console.error("Failed to add report", error);
      triggerNotifikasi("Gagal menyimpan laporan ke database", "error");
    }
  };

  const tanganiEditLaporan = async (reportId, data) => {
    const updatedData = {
      judul_buku: data.judul,
      ringkasan: data.ringkasan,
      status: "Menunggu", // Reset status
      // feedback_guru: "" // Keep feedback so student can see what they addressed
    };

    // Optimistic Update
    const laporanTerupdate = laporan.map(r =>
      r.report_id === reportId ? { ...r, ...updatedData } : r
    );
    setLaporan(laporanTerupdate);
    setEditingReport(null);
    setTabSiswa('home');
    triggerNotifikasi("Laporan diperbaiki! Menunggu verifikasi ulang.", 'success');

    // API Call
    try {
      await api.updateLaporan(reportId, updatedData);
    } catch (error) {
      console.error("Failed to update report", error);
      triggerNotifikasi("Gagal mengupdate laporan di database", "error");
    }
  };

  const tanganiHapusLaporan = async (reportId) => {
    // Optimistic Update
    setLaporan(laporan.filter(r => r.report_id !== reportId));
    triggerNotifikasi("Laporan berhasil dihapus.", 'success');

    // API Call
    try {
      await api.deleteLaporan(reportId);
    } catch (error) {
      console.error("Failed to delete report", error);
      triggerNotifikasi("Gagal menghapus laporan dari database", "error");
    }
  };

  const tanganiVerifikasi = async (reportId, isApproved, catatan = "") => {
    const status = isApproved ? 'Disetujui' : 'Ditolak';
    const previousReport = laporan.find(r => r.report_id === reportId);
    const wasAlreadyApproved = previousReport?.status === 'Disetujui';

    // Optimistic Update
    const laporanTerupdate = laporan.map(r => {
      if (r.report_id === reportId) { return { ...r, status, feedback_guru: catatan }; }
      return r;
    });
    setLaporan(laporanTerupdate);

    // Update User Points if Approved AND it wasn't already approved before
    if (isApproved && !wasAlreadyApproved) {
      const lap = laporan.find(r => r.report_id === reportId);
      if (lap) {
        const student = users.find(u => u.uid === lap.student_uid);
        if (student) {
          const newPoints = student.total_poin + 10;
          const newLevel = hitungLevel(newPoints);
          const updatedStudent = { ...student, total_poin: newPoints, level: newLevel };

          setUsers(users.map(u => u.uid === student.uid ? updatedStudent : u));

          // API Call for User Update
          api.updateUser(student.uid, { total_poin: newPoints, level: newLevel }).catch(err => console.error("Failed to update points", err));
        }
      }
    }

    triggerNotifikasi(`Laporan ${status.toLowerCase()}!`, isApproved ? 'success' : 'error');

    // API Call for Report Update
    try {
      await api.updateLaporan(reportId, { status, feedback_guru: catatan });
    } catch (error) {
      console.error("Failed to verify report", error);
      triggerNotifikasi("Gagal memverifikasi laporan di database", "error");
    }
  };


  const tanganiUpdateProfil = async (updatedData) => {
    // Optimistic Update
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    localStorage.setItem('lentera_user', JSON.stringify(updatedUser));
    setUsers(users.map(u => u.uid === currentUser.uid ? updatedUser : u));
    triggerNotifikasi("Profil berhasil diperbarui!", 'success');

    // API Call
    try {
      await api.updateUser(currentUser.uid, updatedData);
    } catch (error) {
      console.error("Failed to update profile", error);
      triggerNotifikasi("Gagal menyimpan profil ke database", "error");
    }
  };

  const handleUpdateSekolah = async (newData) => {
    setDataSekolah(newData);
    try {
      await api.updateSekolah(newData);
      triggerNotifikasi("Data sekolah berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to update school", error);
      triggerNotifikasi("Gagal menyimpan data sekolah", "error");
    }
  };

  const handleAddClass = async (newClass) => {
    setDataKelas([...dataKelas, newClass]);
    try {
      await api.addClass(newClass);
      triggerNotifikasi("Kelas berhasil ditambahkan", "success");
    } catch (error) {
      console.error("Failed to add class", error);
      triggerNotifikasi("Gagal menyimpan kelas", "error");
    }
  };

  const handleUpdateClass = async (id, updatedClass) => {
    setDataKelas(dataKelas.map(c => c.id === id ? updatedClass : c));
    try {
      await api.updateClass(id, updatedClass);
      triggerNotifikasi("Kelas berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to update class", error);
      triggerNotifikasi("Gagal mengupdate kelas", "error");
    }
  };

  const handleDeleteClass = async (id) => {
    setDataKelas(dataKelas.filter(c => c.id !== id));
    try {
      await api.deleteClass(id);
      triggerNotifikasi("Kelas berhasil dihapus", "success");
    } catch (error) {
      console.error("Failed to delete class", error);
      triggerNotifikasi("Gagal menghapus kelas", "error");
    }
  };

  const handleAddUser = async (newUser) => {
    setUsers([...users, newUser]);
    try {
      await api.addUser(newUser);
      triggerNotifikasi("Siswa berhasil ditambahkan", "success");
    } catch (error) {
      console.error("Failed to add user", error);
      triggerNotifikasi("Gagal menyimpan siswa", "error");
    }
  };

  const handleUpdateUser = async (uid, updatedUser) => {
    setUsers(users.map(u => u.uid === uid ? updatedUser : u));
    if (currentUser && currentUser.uid === uid) {
      setCurrentUser(updatedUser);
      localStorage.setItem('lentera_user', JSON.stringify(updatedUser));
    }
    try {
      await api.updateUser(uid, updatedUser);
      triggerNotifikasi("Data siswa berhasil diperbarui", "success");
    } catch (error) {
      console.error("Failed to update user", error);
      triggerNotifikasi("Gagal mengupdate siswa", "error");
    }
  };

  const handleDeleteUser = async (uid) => {
    setUsers(users.filter(u => u.uid !== uid));
    try {
      // await api.deleteUser(uid); 
      triggerNotifikasi("Siswa berhasil dihapus (Local only for now)", "warning");
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };



  const ToastNotifikasi = () => (
    notifikasi && (
      <div className="fixed top-24 inset-x-0 flex justify-center z-[100] pointer-events-none">
        <div className={`pointer-events-auto px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-bounce-in border border-white/20 backdrop-blur-xl ${tipeNotifikasi === 'success' ? 'bg-gray-900/90 text-white' : 'bg-rose-600/90 text-white'}`}>
          {tipeNotifikasi === 'success' ? <CheckCircle size={20} className="text-emerald-400" /> : <AlertCircle size={20} className="text-white" />}
          <span className="font-medium text-sm tracking-wide">{notifikasi}</span>
        </div>
      </div>
    )
  );

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <ToastNotifikasi />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-orbit" style={{ animationDelay: '0s' }}></div>
          <div className="absolute w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-orbit" style={{ animationDelay: '-5s' }}></div>
          <div className="absolute w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-orbit" style={{ animationDelay: '-10s' }}></div>
        </div>
        <div className="glass-card p-8 rounded-3xl w-full max-w-md relative z-10 transition-all duration-300">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg text-white">
              <BookOpen size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Lentera</h1>
            <p className="text-gray-600 mt-2 font-medium">Literasi Digital & Gamifikasi</p>
          </div>
          <div className="flex p-1 bg-white/40 rounded-xl mb-6 border border-white/50">
            <button onClick={() => { setPeranLogin('murid'); setFormLogin({ username: '', password: '' }); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${peranLogin === 'murid' ? 'bg-white text-indigo-600 shadow-md' : 'text-gray-600 hover:bg-white/50'}`}>
              <User size={18} /> Siswa
            </button>
            <button onClick={() => { setPeranLogin('guru'); setFormLogin({ username: '', password: '' }); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${peranLogin === 'guru' ? 'bg-white text-purple-600 shadow-md' : 'text-gray-600 hover:bg-white/50'}`}>
              <GraduationCap size={18} /> Guru
            </button>
          </div>
          <div className="overflow-hidden min-h-[250px]">
            <form onSubmit={tanganiLogin} className="space-y-4 animate-fade-in-up" key={peranLogin}>
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 transition-colors duration-300 border border-white/50 bg-white/40`}>
                <div className={`p-2 rounded-full shadow-sm bg-white`}>
                  {peranLogin === 'murid' ? <User className="w-6 h-6 text-indigo-600" /> : <GraduationCap className="w-6 h-6 text-purple-600" />}
                </div>
                <div>
                  <p className={`text-sm font-bold ${peranLogin === 'murid' ? 'text-indigo-900' : 'text-purple-900'}`}>Login {peranLogin === 'murid' ? 'Siswa' : 'Guru'}</p>
                  <p className={`text-xs ${peranLogin === 'murid' ? 'text-indigo-700' : 'text-purple-700'}`}>{peranLogin === 'murid' ? 'Gunakan akun dari Data Guru' : 'Silakan login untuk melanjutkan dan mengelola aktivitas siswa.'}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="relative group">
                  <User className="absolute left-4 top-3 text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input type="text" placeholder="Username" value={formLogin.username} onChange={(e) => setFormLogin({ ...formLogin, username: e.target.value })} className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-white/50 focus:bg-white focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-gray-800 placeholder-gray-500 shadow-sm focus:shadow-md" required />
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-3 text-gray-500 group-focus-within:text-indigo-600 transition-colors" size={20} />
                  <input type="password" placeholder="Password (default: 123)" value={formLogin.password} onChange={(e) => setFormLogin({ ...formLogin, password: e.target.value })} className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-white/50 focus:bg-white focus:border-indigo-500 rounded-xl outline-none transition-all font-medium text-gray-800 placeholder-gray-500 shadow-sm focus:shadow-md" required />
                </div>
              </div>
              <button type="submit" disabled={sedangMemuat} className={`w-full py-2.5 mt-2 font-bold rounded-xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2 ${sedangMemuat ? 'bg-gray-400 cursor-not-allowed' : peranLogin === 'murid' ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200' : 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200'}`}>
                {sedangMemuat ? (<> <Loader className="animate-spin" size={18} /> Memproses... </>) : (<> Masuk Sekarang <ChevronRight size={18} /> </>)}
              </button>
            </form>
          </div>
          <div className="mt-4 border-t border-white/30 pt-4"><Footer /></div>
        </div>
      </div>
    );
  }

  // --- TAMPILAN GURU ---
  if (currentUser.role === 'guru') {
    return (
      <TeacherLayout
        currentView={viewGuru}
        setView={setViewGuru}
        laporan={laporan}
        onLogout={tanganiLogout}
        currentUser={currentUser}
      >
        <ToastNotifikasi />
        <DashboardGuru
          laporan={laporan} users={users} onVerify={tanganiVerifikasi} currentView={viewGuru} setView={setViewGuru}
          dataSekolah={dataSekolah} dataKelas={dataKelas}
          currentUser={currentUser} setCurrentUser={setCurrentUser} triggerNotifikasi={triggerNotifikasi}
          onUpdateSekolah={handleUpdateSekolah}
          onAddClass={handleAddClass}
          onUpdateClass={handleUpdateClass}
          onDeleteClass={handleDeleteClass}
          onAddUser={handleAddUser}
          onUpdateUser={handleUpdateUser}
          onDeleteUser={handleDeleteUser}
        />
      </TeacherLayout>
    );
  }
  // --- TAMPILAN SISWA ---
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 relative">
      <ToastNotifikasi />
      {tabSiswa === 'home' && (<BerandaSiswa user={currentUser} poin={currentUser.total_poin} level={currentUser.level} laporan={laporan.filter(r => r.student_uid === currentUser.uid)} onLogout={tanganiLogout} onEditReport={(report) => { setEditingReport(report); setTabSiswa('add'); }} onDeleteReport={tanganiHapusLaporan} triggerNotifikasi={triggerNotifikasi} />)}
      {tabSiswa === 'add' && <StudentInput onSubmit={tanganiKirimLaporan} onEdit={tanganiEditLaporan} editingReport={editingReport} onCancelEdit={() => { setEditingReport(null); setTabSiswa('home'); }} />}
      {tabSiswa === 'library' && <PustakaSiswa laporan={laporan.filter(r => r.student_uid === currentUser.uid)} />}
      {tabSiswa === 'leaderboard' && <StudentLeaderboard users={users} currentUser={currentUser} dataKelas={dataKelas} />}
      {tabSiswa === 'profile' && <StudentProfile user={currentUser} onLogout={tanganiLogout} laporan={laporan.filter(r => r.student_uid === currentUser.uid)} onUpdateProfile={tanganiUpdateProfil} />}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-md border-t border-gray-200 px-6 py-3 pb-4 rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-40">
        <div className="flex justify-between items-center relative z-10">
          <button onClick={() => setTabSiswa('home')} className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${tabSiswa === 'home' ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <Home className={tabSiswa === 'home' ? 'fill-indigo-100' : ''} size={24} strokeWidth={tabSiswa === 'home' ? 2.5 : 2} />
          </button>
          <button onClick={() => setTabSiswa('leaderboard')} className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${tabSiswa === 'leaderboard' ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <Trophy className={tabSiswa === 'leaderboard' ? 'fill-indigo-100' : ''} size={24} strokeWidth={tabSiswa === 'leaderboard' ? 2.5 : 2} />
          </button>

          <div className="relative -mt-12 group">
            <div className="absolute inset-0 bg-indigo-400 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>
            <button onClick={() => setTabSiswa('add')} className="relative w-16 h-16 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white shadow-xl transform transition-transform duration-300 group-hover:scale-105 group-active:scale-95 border-4 border-white">
              <PlusCircle size={32} />
            </button>
          </div>

          <button onClick={() => setTabSiswa('library')} className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${tabSiswa === 'library' ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <BookOpen className={tabSiswa === 'library' ? 'fill-indigo-100' : ''} size={24} strokeWidth={tabSiswa === 'library' ? 2.5 : 2} />
          </button>
          <button onClick={() => setTabSiswa('profile')} className={`flex flex-col items-center gap-1 p-2 transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${tabSiswa === 'profile' ? 'text-indigo-600 scale-110' : 'text-gray-400 hover:text-gray-600'}`}>
            <User className={tabSiswa === 'profile' ? 'fill-indigo-100' : ''} size={24} strokeWidth={tabSiswa === 'profile' ? 2.5 : 2} />
          </button>
        </div>
        <div className="text-center mt-3 flex items-center justify-center gap-1">
          <p className="text-[10px] font-medium text-gray-400 tracking-widest">© {new Date().getFullYear()} | Dibuat oleh Mas Alfy</p>
          <BadgeCheck size={12} className="text-blue-500 fill-blue-100" />
        </div>
      </div>
    </div>
  );
}
