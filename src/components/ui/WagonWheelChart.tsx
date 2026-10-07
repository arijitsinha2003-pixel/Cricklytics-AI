import React, { useState } from 'react';
import { WagonWheelData } from '../../types/cricket';

interface WagonWheelProps {
  data: WagonWheelData;
  totalRuns?: number;
  interactive?: boolean;
}

export const WagonWheelChart: React.FC<WagonWheelProps> = ({ data, totalRuns, interactive = true }) => {
  const [hoveredSector, setHoveredSector] = useState<string | null>(null);

  const calculatedTotal = totalRuns || Object.values(data).reduce((a, b) => a + b, 0) || 1;

  // Sectors setup with angles (degrees, 0 = straight up)
  const sectors = [
    {
      id: 'straight',
      name: 'Straight & Long-On/Off',
      runs: data.straight,
      pct: ((data.straight / calculatedTotal) * 100).toFixed(1),
      startAngle: -30,
      endAngle: 30,
      color: '#10b981', // emerald-500
      glow: 'rgba(16, 185, 129, 0.4)',
      directionText: 'Straight'
    },
    {
      id: 'midwicket',
      name: 'Mid-Wicket & Cow Corner',
      runs: data.midwicket,
      pct: ((data.midwicket / calculatedTotal) * 100).toFixed(1),
      startAngle: 30,
      endAngle: 90,
      color: '#06b6d4', // cyan-500
      glow: 'rgba(6, 182, 212, 0.4)',
      directionText: 'Mid Wicket (Leg)'
    },
    {
      id: 'fineLeg',
      name: 'Square Leg & Fine Leg',
      runs: data.fineLeg,
      pct: ((data.fineLeg / calculatedTotal) * 100).toFixed(1),
      startAngle: 90,
      endAngle: 150,
      color: '#3b82f6', // blue-500
      glow: 'rgba(59, 130, 246, 0.4)',
      directionText: 'Fine Leg'
    },
    {
      id: 'cutBehind',
      name: 'Gully & Behind Point',
      runs: data.cutBehind,
      pct: ((data.cutBehind / calculatedTotal) * 100).toFixed(1),
      startAngle: 150,
      endAngle: 210,
      color: '#a855f7', // purple-500
      glow: 'rgba(168, 85, 247, 0.4)',
      directionText: 'Behind Point'
    },
    {
      id: 'thirdMan',
      name: 'Third Man & Backward Point',
      runs: data.thirdMan,
      pct: ((data.thirdMan / calculatedTotal) * 100).toFixed(1),
      startAngle: 210,
      endAngle: 270,
      color: '#f59e0b', // amber-500
      glow: 'rgba(245, 158, 11, 0.4)',
      directionText: 'Third Man'
    },
    {
      id: 'covers',
      name: 'Cover & Extra Cover',
      runs: data.covers,
      pct: ((data.covers / calculatedTotal) * 100).toFixed(1),
      startAngle: 270,
      endAngle: 330,
      color: '#10b981', // emerald-400
      glow: 'rgba(52, 211, 153, 0.4)',
      directionText: 'Extra Cover (Off)'
    },
  ];

  // Helper to convert polar coords to SVG cartesian
  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    return ['M', x, y, 'L', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y, 'Z'].join(' ');
  };

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6 p-4 bg-slate-900/60 rounded-2xl border border-slate-800/80">
      {/* SVG Cricket Ground Wagon Wheel */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg viewBox="0 0 400 400" className="w-72 h-72 sm:w-80 sm:h-80 select-none">
          {/* Defs for gradients & patterns */}
          <defs>
            <radialGradient id="grassGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#064e3b" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#022c22" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.9" />
            </radialGradient>
            <filter id="wagonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Outer Boundary Oval */}
          <circle cx="200" cy="200" r="185" fill="url(#grassGrad)" stroke="#1e293b" strokeWidth="2" />
          <circle cx="200" cy="200" r="180" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" />

          {/* 30-Yard Circle */}
          <circle cx="200" cy="200" r="115" fill="none" stroke="#334155" strokeWidth="1.5" strokeDasharray="6 6" />

          {/* Sector Wedges */}
          {sectors.map((sec) => {
            const isHovered = hoveredSector === sec.id;
            const wedgeRadius = Math.min(175, Math.max(70, 70 + (sec.runs / (calculatedTotal || 1)) * 140));
            const pathData = describeArc(200, 200, wedgeRadius, sec.startAngle, sec.endAngle);

            return (
              <g key={sec.id} className="transition-all duration-300">
                <path
                  d={pathData}
                  fill={sec.color}
                  fillOpacity={isHovered ? 0.45 : 0.18}
                  stroke={sec.color}
                  strokeWidth={isHovered ? 2.5 : 1.2}
                  className="cursor-pointer transition-all duration-200"
                  onMouseEnter={() => interactive && setHoveredSector(sec.id)}
                  onMouseLeave={() => interactive && setHoveredSector(null)}
                />
              </g>
            );
          })}

          {/* Pitch Rect (Center) */}
          <rect x="194" y="178" width="12" height="44" rx="2" fill="#78350f" stroke="#d97706" strokeWidth="1.5" opacity="0.9" />
          {/* Stumps markers */}
          <line x1="192" y1="184" x2="208" y2="184" stroke="#ffffff" strokeWidth="1.5" />
          <line x1="192" y1="216" x2="208" y2="216" stroke="#ffffff" strokeWidth="1.5" />

          {/* Center Bowler / Batter indicator */}
          <circle cx="200" cy="216" r="3" fill="#10b981" />
          
          {/* Directional Compass Labels on perimeter */}
          <text x="200" y="24" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="600" className="uppercase tracking-widest">Off / Straight</text>
          <text x="360" y="204" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="600" className="uppercase tracking-widest">Leg Side</text>
          <text x="40" y="204" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="600" className="uppercase tracking-widest">Off Side</text>
          <text x="200" y="390" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="600" className="uppercase tracking-widest">Behind Wicket</text>
        </svg>

        {/* Hover / Active Badge overlay */}
        {hoveredSector && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-950/95 border border-emerald-500/50 rounded-full shadow-lg text-xs font-semibold text-emerald-400 flex items-center gap-1.5 pointer-events-none animate-fadeIn">
            <span>{sectors.find(s => s.id === hoveredSector)?.name}:</span>
            <span className="text-white">{sectors.find(s => s.id === hoveredSector)?.runs} runs ({sectors.find(s => s.id === hoveredSector)?.pct}%)</span>
          </div>
        )}
      </div>

      {/* Breakdown Legend & Distribution List */}
      <div className="flex-1 w-full space-y-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Field Sector</span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Runs / Split</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sectors.map((sec) => {
            const isHovered = hoveredSector === sec.id;
            return (
              <div
                key={sec.id}
                onMouseEnter={() => interactive && setHoveredSector(sec.id)}
                onMouseLeave={() => interactive && setHoveredSector(null)}
                className={`p-2.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-between ${
                  isHovered 
                    ? 'bg-slate-800/90 border-emerald-500 shadow-md ring-1 ring-emerald-500/30' 
                    : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: sec.color }} />
                  <div className="truncate">
                    <p className="text-xs font-medium text-slate-200 truncate">{sec.name}</p>
                    <p className="text-[10px] text-slate-400">{sec.directionText}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="text-xs font-bold text-white">{sec.runs}</span>
                  <span className="text-[10px] text-slate-400 ml-1">({sec.pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-2.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
          <span className="text-slate-300">Total Wagon Runs Analyzed</span>
          <span className="font-bold text-emerald-400">{calculatedTotal} runs</span>
        </div>
      </div>
    </div>
  );
};
