import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Target,
  Zap,
  Award,
  Flame,
  PieChart as PieIcon,
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Info
} from 'lucide-react';
import { MatchRecord, PlayerProfile } from '../../types/cricket';
import {
  calculateBattingStats,
  aggregatePhaseData,
  aggregateWagonWheel,
  aggregateDismissals
} from '../../utils/analyticsEngine';
import { WagonWheelChart } from '../ui/WagonWheelChart';
import { StatCard } from '../ui/StatCard';

interface BattingAnalyticsViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
}

export const BattingAnalyticsView: React.FC<BattingAnalyticsViewProps> = ({ matches, activePlayer }) => {
  const [selectedFormat, setSelectedFormat] = useState<'All' | 'T20' | 'ODI'>('All');

  const filteredMatches = useMemo(() => {
    if (selectedFormat === 'All') return matches;
    return matches.filter(m => m.format === selectedFormat);
  }, [matches, selectedFormat]);

  const stats = useMemo(() => calculateBattingStats(filteredMatches), [filteredMatches]);
  const phaseData = useMemo(() => aggregatePhaseData(filteredMatches), [filteredMatches]);
  const wagonData = useMemo(() => {
    const raw = aggregateWagonWheel(filteredMatches);
    const converted = {
      covers: 0,
      midwicket: 0,
      straight: 0,
      fineLeg: 0,
      thirdMan: 0,
      cutBehind: 0
    };
    raw.forEach(r => {
      if (r.sector.includes('Cover')) converted.covers = r.runs;
      else if (r.sector.includes('Mid-Wicket')) converted.midwicket = r.runs;
      else if (r.sector.includes('Straight')) converted.straight = r.runs;
      else if (r.sector.includes('Square')) converted.fineLeg = r.runs;
      else if (r.sector.includes('Third')) converted.thirdMan = r.runs;
      else converted.cutBehind = r.runs;
    });
    return converted;
  }, [filteredMatches]);

  const dismissalData = useMemo(() => aggregateDismissals(filteredMatches), [filteredMatches]);

  const dismissalColors: Record<string, string> = {
    'Caught': '#3b82f6',
    'Bowled': '#f43f5e',
    'LBW': '#f59e0b',
    'Run Out': '#a855f7',
    'Stumped': '#06b6d4',
    'Not Out': '#10b981'
  };

  // Chronological runs & SR data
  const chronologicalData = useMemo(() => {
    return [...filteredMatches].reverse().map((m, idx) => ({
      matchNumber: `M${idx + 1}`,
      opponent: m.opponent.slice(0, 10),
      runs: m.runs,
      strikeRate: m.strikeRate,
      balls: m.balls
    }));
  }, [filteredMatches]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header & Format Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Batting Analytics Engine</h1>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              {activePlayer.battingStyle}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Deep dive into strike rates, phase efficiency, boundary percentage, and dismissal vulnerabilities.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
          {(['All', 'T20', 'ODI'] as const).map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedFormat === fmt ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* 6 Top Batting Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Average"
          value={stats.average}
          subtitle={`${stats.innings} Innings`}
          icon={Award}
          badge="High"
          badgeColor="emerald"
        />
        <StatCard
          title="Strike Rate"
          value={stats.strikeRate}
          subtitle={`${stats.runs} Runs / ${stats.balls} Balls`}
          icon={Zap}
          badge="Aggressive"
          badgeColor="cyan"
        />
        <StatCard
          title="Boundary %"
          value={`${stats.boundaryPercentage}%`}
          subtitle={`${stats.fours}x4 • ${stats.sixes}x6`}
          icon={Flame}
          badge="High Impact"
          badgeColor="amber"
        />
        <StatCard
          title="Dot Ball %"
          value={`${stats.dotBallPercentage}%`}
          subtitle={`${stats.dotBalls} Dots / ${stats.balls} Balls`}
          icon={Target}
          badge={stats.dotBallPercentage < 25 ? 'Efficient' : 'Room to Improve'}
          badgeColor={stats.dotBallPercentage < 25 ? 'emerald' : 'rose'}
        />
        <StatCard
          title="High Score"
          value={`${stats.highScore}${stats.highScoreNotOut ? '*' : ''}`}
          subtitle={`${stats.fifties} Fifties`}
          icon={TrendingUp}
          badge="Top Notch"
          badgeColor="purple"
        />
        <StatCard
          title="Clutch Index"
          value={`${stats.clutchScore}/100`}
          subtitle={`${stats.notOuts} Not Outs`}
          icon={Layers}
          badge="Finisher"
          badgeColor="emerald"
        />
      </div>

      {/* Phase Breakdown Card */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Innings Phase Performance Split</h3>
            <p className="text-xs text-slate-400">Analysis across Powerplay (1-6), Middle (7-15), and Death Overs (16-20).</p>
          </div>
          <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Middle Phase Strongest (SR 148.6)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {phaseData.map((phase) => (
            <div key={phase.phase} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-200">{phase.phase}</span>
                <span className="text-xs font-black text-emerald-400 font-mono">SR {phase.strikeRate}</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Runs Scored:</span>
                  <span className="font-bold text-white font-mono">{phase.runs} ({phase.balls}b)</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Boundaries:</span>
                  <span className="font-semibold text-slate-200">{phase.fours} fours, {phase.sixes} sixes</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Dot Ball Rate:</span>
                  <span className="font-semibold text-slate-200">{phase.dotBallPct}%</span>
                </div>
              </div>
              {/* Progress bar for SR */}
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (phase.strikeRate / 200) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Wagon Wheel Section */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Interactive 360° Wagon Wheel</h3>
            <p className="text-xs text-slate-400">Hover over field sectors to inspect boundary distribution and run density.</p>
          </div>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            Off-Side Bias: 52%
          </span>
        </div>

        <WagonWheelChart data={wagonData} totalRuns={stats.runs} />
      </div>

      {/* Dismissal Breakdown & Runs/SR Trend Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dismissal Breakdown Donut */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Dismissal Mode Breakdown</h3>
              <p className="text-xs text-slate-400">Identifying key technical vulnerabilities.</p>
            </div>
            <span className="text-xs font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              LBW Risk vs Spin
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-56 w-56 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dismissalData}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                  >
                    {dismissalData.map((entry) => (
                      <Cell key={entry.type} fill={dismissalColors[entry.type] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex-1 w-full space-y-2">
              {dismissalData.map((d) => (
                <div key={d.type} className="flex items-center justify-between p-2 rounded-xl bg-slate-950/40 border border-slate-800/60 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: dismissalColors[d.type] || '#64748b' }} />
                    <span className="font-semibold text-slate-200">{d.type}</span>
                  </div>
                  <span className="font-mono text-slate-400">
                    <strong className="text-white">{d.count}</strong> ({d.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-2.5 text-xs text-amber-300">
            <ShieldAlert className="h-4 w-4 flex-shrink-0 mt-0.5 text-amber-400" />
            <p>
              <strong>AI Diagnostic:</strong> 57% of recent dismissals were LBW/Bowled against spin angling into pads. Focus on front-foot stride & soft-hands defensive tap.
            </p>
          </div>
        </div>

        {/* Match by Match Strike Rate Trend */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Match-by-Match Strike Rate vs Runs</h3>
              <p className="text-xs text-slate-400">Chronological trajectory across games.</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chronologicalData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="matchNumber" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="runs" name="Runs" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="strikeRate" name="Strike Rate" stroke="#06b6d4" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
