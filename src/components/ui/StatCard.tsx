import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number; // percentage change vs previous period
  changeLabel?: string;
  trend?: 'up' | 'down' | 'neutral' | 'excellent' | 'improving' | 'stable' | 'declining';
  icon: LucideIcon;
  badge?: string;
  badgeColor?: 'emerald' | 'cyan' | 'amber' | 'rose' | 'purple';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeLabel = 'vs prev 10 matches',
  trend,
  icon: Icon,
  badge,
  badgeColor = 'emerald',
  onClick,
  className = ''
}) => {
  const badgeClasses = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  const isPositive = change !== undefined ? change > 0 : trend === 'up' || trend === 'excellent' || trend === 'improving';
  const isNeutral = change !== undefined ? change === 0 : trend === 'neutral' || trend === 'stable';

  return (
    <div
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 transition-all duration-300 hover:border-slate-700 hover:shadow-xl hover:shadow-emerald-950/20 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {/* Top row: Icon and Badge/Trend */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/80 border border-slate-700/60 text-emerald-400 shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/30">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        </div>

        {badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeClasses[badgeColor]}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Main Value Display */}
      <div className="flex items-baseline justify-between gap-2 mt-1">
        <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-mono">
          {value}
        </div>

        {/* Change indicator */}
        {change !== undefined && (
          <div
            className={`inline-flex items-center gap-1 text-xs font-semibold px-1.5 py-0.5 rounded-md ${
              isNeutral
                ? 'text-slate-400 bg-slate-800/60'
                : isPositive
                ? 'text-emerald-400 bg-emerald-500/10'
                : 'text-rose-400 bg-rose-500/10'
            }`}
          >
            {isNeutral ? (
              <Minus className="h-3 w-3" />
            ) : isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span>{isPositive ? '+' : ''}{change}%</span>
          </div>
        )}
      </div>

      {/* Subtitle / context */}
      {(subtitle || changeLabel) && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
          <span>{subtitle || changeLabel}</span>
        </div>
      )}

      {/* Subtle bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  );
};
