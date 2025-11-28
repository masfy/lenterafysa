import React from 'react';
import { AlertTriangle } from 'lucide-react';

const ModalKonfirmasi = ({ isOpen, pesan, onConfirm, onCancel }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm mx-4 transform transition-all scale-100">
                <div className="flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Konfirmasi Hapus</h3>
                    <p className="text-sm text-gray-500 mb-6">{pesan}</p>
                    <div className="flex gap-3 w-full">
                        <button onClick={onCancel} className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
                        <button onClick={onConfirm} className="flex-1 py-2.5 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalKonfirmasi;
