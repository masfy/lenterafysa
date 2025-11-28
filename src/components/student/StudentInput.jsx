import React, { useState } from 'react';
import { Send, BookOpen, FileText, PenTool } from 'lucide-react';
import StudentHeader from './StudentHeader';

const StudentInput = ({ onSubmit, onEdit, editingReport, onCancelEdit }) => {
    const [formData, setFormData] = useState({ judul: '', ringkasan: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Effect to pre-fill form when editingReport changes
    React.useEffect(() => {
        if (editingReport) {
            setFormData({
                judul: editingReport.judul_buku,
                ringkasan: editingReport.ringkasan
            });
        } else {
            setFormData({ judul: '', ringkasan: '' });
        }
    }, [editingReport]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.judul) return;

        setIsSubmitting(true);
        // Simulate network delay for better UX
        setTimeout(() => {
            if (editingReport) {
                onEdit(editingReport.report_id, formData);
            } else {
                onSubmit(formData);
            }
            setIsSubmitting(false);
            setFormData({ judul: '', ringkasan: '' }); // Reset form
        }, 800);
    };

    return (
        <div className="pb-24 min-h-screen bg-gray-50">
            <StudentHeader
                title={editingReport ? "Perbaiki Laporan" : "Tulis Laporan"}
                subtitle={editingReport ? "Yuk, perbaiki laporanmu agar bisa disetujui!" : "Ceritakan buku seru yang baru kamu baca!"}
                rightElement={
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 shadow-sm">
                        <PenTool size={20} />
                    </div>
                }
            />

            <div className="p-6 animate-fade-in">
                <div className="bg-white rounded-3xl p-6 shadow-xl shadow-indigo-50 border border-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-100 to-transparent rounded-bl-full -mr-8 -mt-8 opacity-50"></div>

                    <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Judul Buku</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <BookOpen size={20} />
                                </div>
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
                                    placeholder="Contoh: Laskar Pelangi"
                                    value={formData.judul}
                                    onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 ml-1">Ringkasan Cerita</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-3.5 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                    <FileText size={20} />
                                </div>
                                <textarea
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-gray-800 placeholder-gray-400 min-h-[150px] resize-none"
                                    placeholder="Tuliskan bagian yang paling menarik menurutmu..."
                                    value={formData.ringkasan}
                                    onChange={(e) => setFormData({ ...formData, ringkasan: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex gap-3">
                            {editingReport && (
                                <button
                                    type="button"
                                    onClick={onCancelEdit}
                                    className="flex-1 py-2.5 rounded-xl font-bold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit"
                                disabled={!formData.judul || isSubmitting}
                                className={`flex-1 py-2.5 rounded-xl font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${!formData.judul || isSubmitting
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-indigo-200 hover:shadow-indigo-300'
                                    }`}
                            >
                                {isSubmitting ? (
                                    <>Menyimpan...</>
                                ) : (
                                    <>
                                        {editingReport ? 'Perbaiki Laporan' : 'Kirim Laporan'} <Send size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-6 bg-indigo-50 rounded-2xl p-4 border border-indigo-100 flex gap-3 items-start">
                    <div className="bg-white p-2 rounded-full text-indigo-500 shadow-sm mt-0.5">
                        <BookOpen size={16} />
                    </div>
                    <div>
                        <h4 className="font-bold text-indigo-900 text-sm">Tips Menulis</h4>
                        <p className="text-indigo-700 text-xs mt-1 leading-relaxed">
                            Ceritakan tokoh favoritmu dan pelajaran apa yang bisa kamu ambil dari buku ini. Tidak perlu terlalu panjang, yang penting jujur!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StudentInput;
