import React, { useState } from 'react';
import { LogOut, User, Star, Award, BookOpen, Camera, Save, X, RefreshCw } from 'lucide-react';
import StudentHeader from './StudentHeader';
import { infoLevel } from '../../data/mockData';

export default function StudentProfile({ user, onLogout, laporan, onUpdateProfile }) {
    const levelInfo = infoLevel(user.level);
    const totalLaporan = laporan.length;
    const [isEditing, setIsEditing] = useState(false);
    const [tempSeed, setTempSeed] = useState(user.username);

    // Calculate progress to next level (mock calculation)
    const progress = Math.min(100, Math.max(0, ((user.total_poin - levelInfo.min) / (levelInfo.max - levelInfo.min)) * 100));

    // Quotes of the day
    const quotes = [
        "Buku adalah jendela dunia.",
        "Membaca adalah napas bagi pikiran.",
        "Semakin banyak kamu membaca, semakin banyak hal yang kamu ketahui.",
        "Buku adalah teman yang tak pernah berkhianat.",
        "Ilmu adalah harta yang tak akan pernah habis.",
        "Membaca adalah cara terbaik untuk berpetualang tanpa harus pergi ke mana-mana."
    ];
    const todayQuote = quotes[new Date().getDate() % quotes.length];

    // Curated list of 27 avatars with positive vibes, including peci and hijab
    const AVATAR_SEEDS = [
        // Boys with Peci/Kopiah (using 'hat' or specific styles if available, otherwise simulating with specific seeds known to look like it or just positive male avatars)
        "Felix", "Aneka", "Zack", "Leo", "Micah",
        // Girls with Hijab (using 'hijab' or 'turban' style seeds)
        "Hijab1", "Hijab2", "Amina", "Sarah", "Leila",
        // General Positive Vibes (Boys & Girls)
        "HappyBoy1", "HappyGirl1", "Smile1", "Joy", "Sunny",
        "Buddy", "Pal", "Friend", "Cheerful", "Bright",
        "Laugh", "Grin", "Beam", "Glee", "Merry",
        "Jolly", "Bliss"
    ];

    // Enhanced URL generator to ensure specific styles for peci/hijab
    // Using specific valid values for DiceBear Avataaars
    const getAvatarUrl = (seed) => {
        let params = "mouth=smile&eyebrows=default&eyes=happy"; // Base positive vibes

        if (["Hijab1", "Hijab2", "Amina", "Sarah", "Leila"].includes(seed)) {
            // Force hijab
            params += "&top=hijab&accessoriesProbability=100&accessories=round,prescription01,prescription02";
        } else if (["Felix", "Aneka", "Zack", "Leo", "Micah"].includes(seed)) {
            // Force hat/turban (closest to Peci)
            params += "&top=hat,turban&accessoriesProbability=0";
        } else {
            // General positive vibes
            params += "&accessoriesProbability=20";
        }

        return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&${params}`;
    };

    const handleSave = () => {
        onUpdateProfile({
            foto_url: getAvatarUrl(tempSeed)
        });
        setIsEditing(false);
    };

    const handleRandomize = () => {
        const randomSeed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
        setTempSeed(randomSeed);
    };

    return (
        <div className="pb-24 min-h-screen bg-gray-50">
            <StudentHeader
                title="Profil Saya"
                rightElement={
                    <button onClick={onLogout} className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-sm hover:bg-red-100 transition-colors">
                        <LogOut size={20} />
                    </button>
                }
            />

            <div className="p-6 animate-fade-in space-y-6">
                {/* Profile Card - Liquid Glass */}
                <div className="relative overflow-hidden rounded-3xl shadow-xl group">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400 opacity-90"></div>
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/20 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none animate-pulse-slow"></div>
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-300/30 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none animate-float"></div>

                    <div className="relative z-10 p-6 flex flex-col items-center">
                        <div className="relative group mb-4">
                            <div className="w-32 h-32 rounded-full border-4 border-white/30 shadow-lg overflow-hidden bg-white/20 backdrop-blur-sm relative z-10 transform transition-transform duration-500 group-hover:scale-105">
                                <img src={isEditing ? getAvatarUrl(tempSeed) : (user.foto_url || getAvatarUrl(user.username))} alt="avatar" className="w-full h-full object-cover" />
                            </div>
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="absolute bottom-1 right-1 z-20 bg-white text-indigo-600 p-2.5 rounded-full shadow-lg border border-indigo-50 hover:bg-indigo-50 transition-all hover:scale-110 hover:rotate-12"
                            >
                                <Camera size={18} />
                            </button>
                        </div>

                        {isEditing && (
                            <div className="mb-6 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/50 w-full max-w-xs animate-fade-in-up shadow-lg">
                                <p className="text-xs text-center text-gray-500 mb-3 font-bold uppercase tracking-wider">Ganti Gaya Avatar</p>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={handleRandomize} className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-200 transition-colors">
                                        <RefreshCw size={14} /> Acak
                                    </button>
                                    <button onClick={handleSave} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 rounded-xl text-xs font-bold text-white hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors">
                                        <Save size={14} /> Simpan
                                    </button>
                                    <button onClick={() => { setIsEditing(false); setTempSeed(user.username); }} className="flex items-center gap-1.5 px-3 py-2 bg-red-50 rounded-xl text-xs font-bold text-red-600 hover:bg-red-100 transition-colors">
                                        <X size={14} /> Batal
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="text-center text-white">
                            <h2 className="text-2xl font-bold tracking-tight drop-shadow-sm">{user.nama_lengkap}</h2>
                            <p className="text-indigo-100 font-medium text-sm mt-1 bg-white/20 px-3 py-1 rounded-full inline-block backdrop-blur-sm">Siswa Kelas {user.kelas}</p>
                        </div>

                        <div className="mt-6 w-full bg-black/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                            <div className="flex justify-between items-center mb-2 text-white">
                                <span className="text-xs font-bold flex items-center gap-1"><Award size={14} className="text-yellow-300" /> {levelInfo.label}</span>
                                <span className="text-xs font-medium opacity-90">{user.total_poin} / {levelInfo.max} XP</span>
                            </div>
                            <div className="h-3 w-full bg-black/20 rounded-full overflow-hidden border border-white/10 p-0.5">
                                <div
                                    className="h-full bg-gradient-to-r from-yellow-300 to-orange-400 rounded-full shadow-lg relative overflow-hidden transition-all duration-1000 ease-out"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute inset-0 bg-white/30 skew-x-12 w-full animate-shimmer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote of the Day */}
                <div className="bg-gradient-to-r from-amber-100 to-orange-100 p-5 rounded-3xl shadow-sm border border-amber-200 relative overflow-hidden">
                    <div className="absolute -right-6 -bottom-6 text-amber-200 opacity-50">
                        <BookOpen size={100} />
                    </div>
                    <h3 className="text-amber-800 font-bold text-sm mb-2 flex items-center gap-2">
                        <Star size={16} className="fill-amber-500 text-amber-500" /> Quote Hari Ini
                    </h3>
                    <p className="text-amber-900 font-medium italic relative z-10 leading-relaxed">
                        "{todayQuote}"
                    </p>
                </div>

                {/* Stats Grid - Multicolor Pastel */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-5 rounded-3xl shadow-sm border border-blue-100 flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-white text-blue-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <BookOpen size={24} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-blue-900">{totalLaporan}</h3>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wide">Buku Dibaca</p>
                        </div>
                    </div>

                    <div className="bg-purple-50 p-5 rounded-3xl shadow-sm border border-purple-100 flex flex-col items-center justify-center gap-2 group hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-white text-purple-500 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                            <Star size={24} className="fill-current" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-purple-900">{user.total_poin}</h3>
                            <p className="text-xs text-purple-600 font-bold uppercase tracking-wide">Total Poin</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
