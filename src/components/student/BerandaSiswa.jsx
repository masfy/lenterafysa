import React from 'react';
import { LogOut, Trophy, BookOpen, Star, TrendingUp, Sparkles, AlertCircle, Bell, CheckCircle } from 'lucide-react';
import { infoLevel, LEVELS } from '../../data/mockData';
import Footer from '../common/Footer';
import StudentHeader from './StudentHeader';

const BerandaSiswa = ({ user, poin, level, laporan, onLogout, onEditReport, onDeleteReport, triggerNotifikasi }) => {
    const infoLvl = infoLevel(level);
    const levelBerikutnya = LEVELS.find(l => l.level === level + 1);
    const progress = levelBerikutnya ? ((poin - infoLvl.min) / (levelBerikutnya.min - infoLvl.min)) * 100 : 100;

    // Local state to track dismissed notifications
    const [dismissedReports, setDismissedReports] = React.useState([]);
    const [hasUnread, setHasUnread] = React.useState(true);
    const [showNotifications, setShowNotifications] = React.useState(false);

    const rejectedReports = laporan.filter(l => l.status === 'Ditolak' && !dismissedReports.includes(l.report_id));

    // Derive notifications from reports
    const notifications = laporan
        .filter(l => l.status === 'Disetujui' || l.status === 'Ditolak')
        .sort((a, b) => new Date(b.tanggal_kirim) - new Date(a.tanggal_kirim))
        .slice(0, 5); // Show top 5 recent notifications

    const handleDismiss = (id) => {
        setDismissedReports([...dismissedReports, id]);
    };

    const handleToggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (!showNotifications) {
            setHasUnread(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24" onClick={() => showNotifications && setShowNotifications(false)}>
            <StudentHeader
                title={`Halo, ${user.nama_lengkap.split(' ')[0]}!`}
                subtitle="Siap bertualang di dunia buku hari ini?"
                rightElement={
                    <div className="flex items-center gap-3 relative" onClick={e => e.stopPropagation()}>
                        <div className="relative">
                            <button onClick={handleToggleNotifications} className={`p-2 rounded-full transition-colors shadow-sm border relative group ${showNotifications ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white text-gray-400 hover:bg-blue-50 hover:text-blue-600 border-gray-100'}`} title="Notifikasi">
                                {hasUnread && notifications.length > 0 && <div className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></div>}
                                <Bell size={20} />
                            </button>

                            {showNotifications && (
                                <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-fade-in-up origin-top-right">
                                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 backdrop-blur-sm">
                                        <h3 className="font-bold text-gray-800 text-sm">Notifikasi</h3>
                                    </div>
                                    <div className="max-h-[300px] overflow-y-auto custom-scrollbar">
                                        {notifications.length > 0 ? (
                                            notifications.map((notif, idx) => (
                                                <div key={idx} className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start">
                                                    <div className={`mt-1 p-1.5 rounded-full flex-shrink-0 ${notif.status === 'Disetujui' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                        {notif.status === 'Disetujui' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800 line-clamp-1">{notif.judul_buku}</p>
                                                        <p className="text-xs text-gray-500 mt-0.5">
                                                            Laporan Anda <span className={notif.status === 'Disetujui' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>{notif.status.toLowerCase()}</span>
                                                        </p>
                                                        <p className="text-[10px] text-gray-400 mt-1">{notif.tanggal_kirim}</p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-8 text-center text-gray-400">
                                                <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                                <p className="text-xs">Belum ada notifikasi</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={onLogout} className="p-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-sm" title="Keluar">
                            <LogOut size={20} />
                        </button>
                    </div>
                }
            />

            {rejectedReports.length > 0 && (
                <div className="px-6 pt-6 animate-fade-in">
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-4 shadow-sm">
                        <h3 className="text-red-800 font-bold flex items-center gap-2 mb-3">
                            <AlertCircle size={20} /> Laporan Perlu Perbaikan
                        </h3>
                        <div className="space-y-3">
                            {rejectedReports.map(report => (
                                <div key={report.report_id} className="bg-white p-4 rounded-xl border border-red-100 shadow-sm">
                                    <div className="mb-3">
                                        <p className="font-bold text-gray-800 text-sm">{report.judul_buku}</p>
                                        <p className="text-xs text-gray-500 mt-1">Catatan Guru:</p>
                                        <p className="text-sm text-red-600 mt-0.5 font-medium">{report.feedback_guru || "Tidak ada catatan."}</p>
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2 border-t border-gray-50">
                                        <button onClick={() => handleDismiss(report.report_id)} className="px-3 py-1.5 text-xs font-bold text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                            Tutup
                                        </button>
                                        <button onClick={() => onDeleteReport(report.report_id)} className="px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            Hapus
                                        </button>
                                        <button onClick={() => onEditReport(report)} className="px-3 py-1.5 text-xs font-bold bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors shadow-sm">
                                            Perbaiki
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-6 animate-fade-in">
                {/* Level Card - Liquid Glass Style */}
                <div className="relative overflow-hidden rounded-3xl shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 animate-gradient-xy"></div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>

                    <div className="relative z-10 p-6 text-white">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm border border-white/10 flex items-center gap-1">
                                        <Sparkles size={10} className="text-yellow-300" /> Level {infoLvl.level}
                                    </span>
                                </div>
                                <h2 className="text-3xl font-bold tracking-tight">{infoLvl.label}</h2>
                            </div>
                            <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                                <Trophy className="w-6 h-6 text-yellow-300 fill-current" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm font-medium text-indigo-100">
                                <span>Progress XP</span>
                                <span>{poin} / {levelBerikutnya ? levelBerikutnya.min : 'MAX'}</span>
                            </div>
                            <div className="h-4 bg-black/20 rounded-full overflow-hidden backdrop-blur-sm border border-white/10 p-0.5">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full shadow-lg relative overflow-hidden transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/30 skew-x-12 w-full animate-shimmer"></div>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-200 mt-2 text-right italic">
                                {levelBerikutnya ? `${levelBerikutnya.min - poin} XP lagi untuk naik level!` : 'Kamu sudah mencapai level maksimal!'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid - Multicolor Pastel Liquid Glass */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-5 rounded-3xl shadow-sm border border-blue-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-blue-200/50 rounded-full blur-xl -mr-5 -mt-5"></div>
                        <div className="relative z-10 w-12 h-12 bg-white text-blue-500 rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={24} />
                        </div>
                        <span className="relative z-10 text-3xl font-bold text-blue-900 mb-1">{laporan.length}</span>
                        <span className="relative z-10 text-xs font-bold text-blue-600 uppercase tracking-wide">Buku Dibaca</span>
                    </div>

                    <div className="bg-green-50 p-5 rounded-3xl shadow-sm border border-green-100 flex flex-col items-center justify-center text-center group hover:shadow-md transition-all duration-300 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-green-200/50 rounded-full blur-xl -mr-5 -mt-5"></div>
                        <div className="relative z-10 w-12 h-12 bg-white text-green-500 rounded-2xl flex items-center justify-center mb-3 shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Star size={24} className="fill-current" />
                        </div>
                        <span className="relative z-10 text-3xl font-bold text-green-900 mb-1">{laporan.filter(r => r.status === 'Disetujui').length}</span>
                        <span className="relative z-10 text-xs font-bold text-green-600 uppercase tracking-wide">Disetujui</span>
                    </div>
                </div>

                {/* Recent Activity / Motivation - Multicolor Pastel Liquid Glass */}
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-3xl p-6 shadow-sm border border-indigo-100 relative overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-200/30 rounded-full blur-2xl -ml-10 -mb-10"></div>
                    <h3 className="relative z-10 font-bold text-indigo-900 mb-4 flex items-center gap-2">
                        <TrendingUp size={20} className="text-indigo-600" /> Statistik Membaca
                    </h3>
                    <div className="relative z-10 space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                                <span className="text-sm text-gray-700 font-bold">Bulan Ini</span>
                            </div>
                            <span className="font-bold text-indigo-900">{Math.floor(Math.random() * 5) + 1} Buku</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/60 backdrop-blur-sm rounded-2xl border border-white/50 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                                <span className="text-sm text-gray-700 font-bold">Total Poin</span>
                            </div>
                            <span className="font-bold text-indigo-900">{poin} XP</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BerandaSiswa;
