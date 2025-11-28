import React from 'react';

export default function StudentHeader({ title, subtitle, rightElement }) {
    return (
        <header className="sticky top-0 z-50 px-6 py-4 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-300">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 tracking-tight">{title}</h1>
                    {subtitle && <p className="text-gray-500 text-xs font-medium mt-0.5">{subtitle}</p>}
                </div>
                {rightElement && (
                    <div className="flex-shrink-0">
                        {rightElement}
                    </div>
                )}
            </div>
        </header>
    );
}
