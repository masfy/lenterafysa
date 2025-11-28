import React from 'react';
import { Trophy, Medal, Crown, Star, AlertCircle } from 'lucide-react';
import StudentHeader from './StudentHeader';
import { infoLevel } from '../../data/mockData';

export default function StudentLeaderboard({ users = [], currentUser }) {
  // Safety check
  if (!users) {
    console.error("StudentLeaderboard: users prop is missing or null");
    return null;
  }

  // Filter only students and sort by points
  const sortedUsers = users
    .filter(u => u.role === 'murid')
    .sort((a, b) => b.total_poin - a.total_poin);

  console.log("StudentLeaderboard: sortedUsers", sortedUsers);

  const topThree = sortedUsers.slice(0, 3);
  const restUsers = sortedUsers.slice(3);

  const getRankIcon = (index) => {
    switch (index) {
      case 0: return <Crown className="text-yellow-500 fill-current animate-bounce-slow" size={32} />;
      case 1: return <Medal className="text-gray-400 fill-current" size={28} />;
      case 2: return <Medal className="text-orange-400 fill-current" size={28} />;
      default: return <span className="font-bold text-gray-500">#{index + 1}</span>;
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <StudentHeader
        title="Papan Peringkat"
        subtitle="Siapa yang paling rajin membaca?"
        rightElement={
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 shadow-sm">
            <Trophy size={20} />
          </div>
        }
      />

      <div className="p-6 animate-fade-in">
        {sortedUsers.length === 0 ? (
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
            <div className="flex justify-center items-end gap-3 mb-10 mt-6 min-h-[200px]">
              {/* 2nd Place */}
              {topThree[1] ? (
                <div className="flex flex-col items-center w-1/3 group">
                  <div className="w-16 h-16 rounded-full border-4 border-gray-300 overflow-hidden shadow-lg mb-2 relative ring-4 ring-gray-50 group-hover:scale-105 transition-transform">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[1].username}`} alt={topThree[1].nama_lengkap} />
                    <div className="absolute bottom-0 right-0 bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">2</div>
                  </div>
                  <p className="font-bold text-sm text-center line-clamp-1 text-gray-800">{topThree[1].nama_lengkap}</p>
                  <p className="text-xs text-gray-500 font-bold bg-gray-100 px-2 py-0.5 rounded-full mt-1">{topThree[1].total_poin} Poin</p>
                  <div className="h-24 w-full bg-gradient-to-t from-gray-300 to-gray-100 rounded-t-2xl mt-2 shadow-inner opacity-80"></div>
                </div>
              ) : <div className="w-1/3"></div>}

              {/* 1st Place */}
              {topThree[0] ? (
                <div className="flex flex-col items-center w-1/3 -mt-8 z-10 group">
                  <div className="absolute -mt-12 animate-bounce-slow">{getRankIcon(0)}</div>
                  <div className="w-24 h-24 rounded-full border-4 border-yellow-400 overflow-hidden shadow-xl mb-2 relative ring-4 ring-yellow-100 group-hover:scale-105 transition-transform">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[0].username}`} alt={topThree[0].nama_lengkap} />
                    <div className="absolute bottom-0 right-0 bg-yellow-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full border-2 border-white">1</div>
                  </div>
                  <p className="font-bold text-base text-center line-clamp-1 text-indigo-900">{topThree[0].nama_lengkap}</p>
                  <p className="text-xs text-yellow-700 font-bold bg-yellow-100 px-3 py-0.5 rounded-full mt-1">{topThree[0].total_poin} Poin</p>
                  <div className="h-36 w-full bg-gradient-to-t from-yellow-300 to-yellow-100 rounded-t-2xl mt-2 shadow-lg relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/30 skew-y-12 transform translate-y-10"></div>
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <Star className="w-6 h-6 text-yellow-500 fill-current inline-block animate-pulse" />
                    </div>
                  </div>
                </div>
              ) : <div className="w-1/3"></div>}

              {/* 3rd Place */}
              {topThree[2] ? (
                <div className="flex flex-col items-center w-1/3 group">
                  <div className="w-16 h-16 rounded-full border-4 border-orange-300 overflow-hidden shadow-lg mb-2 relative ring-4 ring-orange-50 group-hover:scale-105 transition-transform">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${topThree[2].username}`} alt={topThree[2].nama_lengkap} />
                    <div className="absolute bottom-0 right-0 bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white">3</div>
                  </div>
                  <p className="font-bold text-sm text-center line-clamp-1 text-gray-800">{topThree[2].nama_lengkap}</p>
                  <p className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full mt-1">{topThree[2].total_poin} Poin</p>
                  <div className="h-20 w-full bg-gradient-to-t from-orange-300 to-orange-100 rounded-t-2xl mt-2 shadow-inner opacity-80"></div>
                </div>
              ) : <div className="w-1/3"></div>}
            </div>

            {/* Full List */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-700 mb-4 px-2">Peringkat Keseluruhan</h3>
              {sortedUsers.map((user, index) => (
                <div key={user.uid} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${user.uid === currentUser?.uid ? 'bg-indigo-50 border-indigo-200 shadow-md' : 'bg-white border-gray-100 hover:shadow-md'}`}>
                  <div className={`font-bold w-8 text-center text-lg ${index < 3 ? 'text-yellow-500' : 'text-gray-400 italic'}`}>
                    {index < 3 ? <Trophy size={20} className="mx-auto" /> : `#${index + 1}`}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} alt={user.nama_lengkap} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-bold text-base ${user.uid === currentUser?.uid ? 'text-indigo-900' : 'text-gray-800'}`}>{user.nama_lengkap}</h4>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{infoLevel(user.level).label}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      <span className="text-xs font-bold text-indigo-600">{user.total_poin} Poin</span>
                    </div>
                  </div>
                  {user.uid === currentUser?.uid && (
                    <div className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold shadow-indigo-200 shadow-lg">Saya</div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
