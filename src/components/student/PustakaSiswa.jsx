import React from 'react';
import { FileText, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import StudentHeader from './StudentHeader';

export default function PustakaSiswa({ laporan }) {
  // Sort laporan by date (newest first)
  const sortedLaporan = [...laporan].sort((a, b) => new Date(b.tanggal_kirim) - new Date(a.tanggal_kirim));

  const getStatusColor = (status) => {
    switch (status) {
      case 'Disetujui': return 'bg-green-100 text-green-600 border-green-200';
      case 'Ditolak': return 'bg-red-100 text-red-600 border-red-200';
      default: return 'bg-orange-100 text-orange-600 border-orange-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Disetujui': return <CheckCircle size={16} />;
      case 'Ditolak': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-gray-50">
      <StudentHeader
        title="Riwayat Laporan"
        subtitle="Daftar laporan literasi yang telah kamu kirim"
        rightElement={
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
            <FileText size={20} />
          </div>
        }
      />

      <div className="p-6 space-y-4 animate-fade-in">
        {sortedLaporan.length > 0 ? (
          sortedLaporan.map((lap) => (
            <div key={lap.report_id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{lap.judul_buku}</h3>
                  <p className="text-xs text-gray-400 font-medium">{lap.tanggal_kirim}</p>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 border ${getStatusColor(lap.status)}`}>
                  {getStatusIcon(lap.status)}
                  {lap.status}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 mb-3 border border-gray-100">
                <p className="text-gray-600 text-sm line-clamp-2 italic">"{lap.ringkasan}"</p>
              </div>

              {lap.feedback_guru && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex gap-3 items-start animate-fade-in">
                  <div className="mt-0.5 text-indigo-500">
                    <AlertCircle size={16} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase mb-0.5">Catatan Guru</p>
                    <p className="text-sm text-gray-700 font-medium">{lap.feedback_guru}</p>
                  </div>
                </div>
              )}

              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -mr-12 -mt-12 opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-4">
              <FileText size={40} />
            </div>
            <h3 className="text-lg font-bold text-gray-600">Belum ada laporan</h3>
            <p className="text-gray-400 text-sm max-w-xs mx-auto mt-1">Yuk, mulai baca buku dan kirim laporanmu sekarang!</p>
          </div>
        )}
      </div>
    </div>
  );
}
