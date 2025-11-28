import React from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';

export const SimpleBarChart = ({ data, title, color = "bg-indigo-500", colors = [] }) => {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
        <div className="glass-card p-6 rounded-2xl flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <BarChart2 size={64} className="text-indigo-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2 relative z-10">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                    <BarChart2 size={18} />
                </div>
                {title}
            </h3>
            <div className="flex items-end justify-between gap-2 h-48 flex-1 pt-4 px-2 relative z-10">
                {data.map((d, i) => {
                    const barColor = colors.length > 0 ? colors[i % colors.length] : color;
                    return (
                        <div key={i} className="flex flex-col items-center gap-2 flex-1 group/bar relative h-full justify-end">
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 bg-gray-800/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-lg pointer-events-none whitespace-nowrap z-20 shadow-lg">
                                <span className="font-bold">{d.label}</span>: {d.value}
                                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800/90 rotate-45"></div>
                            </div>
                            {/* Bar */}
                            <div className="w-full relative flex items-end justify-center h-full">
                                <div
                                    className={`w-full max-w-[40px] rounded-t-xl ${barColor} opacity-80 group-hover/bar:opacity-100 transition-all duration-500 ease-out relative overflow-hidden shadow-sm hover:shadow-md animate-grow-up`}
                                    style={{
                                        height: `${(d.value / maxVal) * 100}%`,
                                        minHeight: '8px',
                                        animationDelay: `${i * 100}ms`
                                    }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white/30 to-transparent"></div>
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
                                </div>
                            </div>
                            <span className="text-xs text-gray-500 font-medium truncate w-full text-center group-hover/bar:text-indigo-600 transition-colors">{d.label}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export const SimpleLineChart = ({ data, title }) => {
    const maxVal = Math.max(...data.map(d => d.value), 5);
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.value / maxVal) * 100;
        return `${x},${y}`;
    }).join(' ');

    // Create area polygon points (line points + bottom right + bottom left)
    const areaPoints = `${points} 100,100 0,100`;

    return (
        <div className="glass-card p-6 rounded-2xl flex flex-col h-full relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12">
                <TrendingUp size={120} className="text-emerald-600" />
            </div>
            <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600 shadow-sm">
                        <TrendingUp size={18} />
                    </div>
                    {title}
                </h3>
            </div>
            <div className="flex-1 flex items-end relative z-10 min-h-[200px]">
                <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Dashed Grid Lines */}
                    {[0, 25, 50, 75, 100].map((y, i) => (
                        <line key={i} x1="0" y1={y} x2="100" y2={y} stroke="rgba(0,0,0,0.05)" strokeWidth="0.5" strokeDasharray="4 4" />
                    ))}

                    {/* Gradient Area */}
                    <polygon
                        points={areaPoints}
                        fill="url(#chartGradient)"
                        className="animate-fade-in"
                    />

                    {/* The Line */}
                    <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="1.5"
                        points={points}
                        className="drop-shadow-sm animate-draw-line"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Points */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * 100;
                        const y = 100 - (d.value / maxVal) * 100;
                        return (
                            <g key={i} className="group/point">
                                {/* Invisible hover target area (larger) */}
                                <circle cx={x} cy={y} r="6" fill="transparent" className="cursor-pointer" />

                                {/* Visible Point */}
                                <circle
                                    cx={x}
                                    cy={y}
                                    r="2"
                                    fill="white"
                                    stroke="#10b981"
                                    strokeWidth="1.5"
                                    className="pointer-events-none transition-all duration-300 group-hover/point:r-4 group-hover/point:stroke-emerald-500 shadow-sm"
                                />

                                {/* Tooltip for point */}
                                <g className="opacity-0 group-hover/point:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover/point:translate-y-0">
                                    <rect x={x - 12} y={y - 35} width="24" height="20" rx="6" fill="#1f2937" className="opacity-90 shadow-lg" />
                                    <polygon points={`${x - 4},${y - 16} ${x + 4},${y - 16} ${x},${y - 12}`} fill="#1f2937" className="opacity-90" />
                                    <text x={x} y={y - 22} textAnchor="middle" fontSize="8" fill="white" fontWeight="bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                                        {d.value}
                                    </text>
                                </g>
                            </g>
                        );
                    })}
                </svg>
                {/* X Axis Labels */}
                <div className="absolute bottom-[-24px] left-0 w-full flex justify-between text-[10px] text-gray-400 font-medium px-1">
                    {data.map((d, i) => <span key={i}>{d.label.substring(0, 3)}</span>)}
                </div>
            </div>
        </div>
    );
};
