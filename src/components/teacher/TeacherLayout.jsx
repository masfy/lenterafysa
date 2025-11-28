import React, { useState } from 'react';
import {
    BookOpen, BarChart2, CheckCircle, FileText, Trophy,
    School, Layout, Users, Settings, LogOut, Menu, X
} from 'lucide-react';

const TeacherLayout = ({
    children,
    currentView,
    setView,
    laporan,
    onLogout,
    currentUser
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
        { id: 'verifikasi', label: 'Verifikasi', icon: CheckCircle, badge: laporan.filter(r => r.status === 'Menunggu').length, badgeColor: 'bg-orange-100 text-orange-600' },
        { id: 'rekap', label: 'Rekap Laporan', icon: FileText },
        { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
        { section: 'Data Master' },
        { id: 'sekolah', label: 'Data Sekolah', icon: School },
        { id: 'kelas', label: 'Data Kelas', icon: Layout },
        { id: 'siswa', label: 'Data Siswa', icon: Users },
        { section: 'Pengaturan' },
        { id: 'profil', label: 'Profil Saya', icon: Settings },
    ];

    const handleMenuClick = (viewId) => {
        setView(viewId);
        setIsMobileMenuOpen(false);
    };

    const SidebarContent = ({ mobile = false }) => (
        <div className="flex flex-col h-full">
            <div
                className={`p-6 flex items-center gap-3 border-b border-gray-100/50 bg-white/30 backdrop-blur-sm transition-all duration-300 ${!mobile && isCollapsed ? 'justify-center p-4' : ''} cursor-pointer hover:bg-white/40`}
                onClick={() => !mobile && setIsCollapsed(!isCollapsed)}
                title={!mobile ? (isCollapsed ? "Expand Sidebar" : "Collapse Sidebar") : ""}
            >
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 flex-shrink-0">
                    <BookOpen size={20} />
                </div>
                {(!isCollapsed || mobile) && (
                    <div className="overflow-hidden whitespace-nowrap">
                        <span className="font-extrabold text-xl tracking-tight text-gray-800 block">Lentera</span>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Teacher Panel</span>
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar overflow-x-hidden">
                {menuItems.map((item, idx) => {
                    if (item.section) {
                        return (!isCollapsed || mobile) && (
                            <p key={idx} className="px-4 text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-2 mt-6 whitespace-nowrap">
                                {item.section}
                            </p>
                        );
                    }
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => handleMenuClick(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-indigo-50 text-indigo-600 shadow-sm'
                                : 'text-gray-500 hover:bg-white/50 hover:text-indigo-600'
                                } ${!mobile && isCollapsed ? 'justify-center px-2' : ''}`}
                            title={!mobile && isCollapsed ? item.label : ""}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-r-full"></div>
                            )}
                            <Icon size={20} className={`transition-transform duration-300 flex-shrink-0 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                            {(!isCollapsed || mobile) && <span className="relative z-10 whitespace-nowrap">{item.label}</span>}
                            {item.badge > 0 && (
                                <span className={`ml-auto ${item.badgeColor} px-2.5 py-0.5 rounded-full text-xs font-extrabold shadow-sm ${!mobile && isCollapsed ? 'absolute top-2 right-2 w-2 h-2 p-0 border border-white' : ''}`}>
                                    {(!isCollapsed || mobile) ? item.badge : ''}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="p-4 border-t border-gray-100/50 bg-white/30 backdrop-blur-sm">
                <div className={`flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-white/50 border border-white shadow-sm ${!mobile && isCollapsed ? 'justify-center px-2' : ''}`}>
                    <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                        <img src={currentUser?.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser?.username}`} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    {(!isCollapsed || mobile) && (
                        <div className="flex-1 min-w-0 overflow-hidden">
                            <p className="text-sm font-bold text-gray-800 truncate">{currentUser?.nama_lengkap}</p>
                            <p className="text-xs text-gray-500 truncate">Guru Pengajar</p>
                        </div>
                    )}
                </div>
                <button
                    onClick={onLogout}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold transition-colors ${!mobile && isCollapsed ? 'justify-center' : ''}`}
                    title={!mobile && isCollapsed ? "Keluar" : ""}
                >
                    <LogOut size={20} className="flex-shrink-0" /> {(!isCollapsed || mobile) && "Keluar"}
                </button>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-[#F3F4F6] font-sans text-gray-900 overflow-hidden relative selection:bg-indigo-100 selection:text-indigo-700">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
                <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-pink-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 z-40 flex items-center justify-between px-4 shadow-sm no-print">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-md">
                        <BookOpen size={16} />
                    </div>
                    <span className="font-extrabold text-lg text-gray-800">Lentera</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Mobile Sidebar Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden no-print">
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
                    <div className="absolute top-0 left-0 bottom-0 w-72 bg-white/90 backdrop-blur-xl shadow-2xl animate-slide-in-left">
                        <SidebarContent mobile={true} />
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className={`hidden md:block bg-white/60 backdrop-blur-xl border-r border-white/50 h-screen sticky top-0 z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 no-print ${isCollapsed ? 'w-24' : 'w-72'}`}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10 pt-16 md:pt-0">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 scroll-smooth">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TeacherLayout;
