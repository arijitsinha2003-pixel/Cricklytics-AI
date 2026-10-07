import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Award,
  Zap,
  Flame,
  ShieldAlert,
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  CheckCircle,
  Clock,
  Target,
  ChevronRight,
  Activity,
  Layers
} from 'lucide-react';
import { MatchRecord, PlayerProfile, UserAccount } from '../../types/cricket';
import { calculateOverallKPIs } from '../../utils/analyticsEngine';
import { StatCard } from '../ui/StatCard';

interface OverviewViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
  user: UserAccount | null;
  onSelectMatch: (match: MatchRecord) => void;
  onNavigateToBatting: () => void;
  onNavigateToBowling: () => void;
  onNavigateToCoach: () => void;
  onNavigateToPrediction: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  matches,
  activePlayer,
  user,
  onSelectMatch,
  onNavigateToBatting,
  onNavigateToBowling,
  onNavigateToCoach,
  onNavigateToPrediction,
}) => {
  const [matchCountFilter, setMatchCountFilter] = useState<'5' | '10' | '20' | 'all'>('10');
  const [activeMetric, setActiveMetric] = useState<'runs' | 'strikeRate' | 'average' | 'wickets' | 'economy'>('runs');

  // Compute live KPIs from the current match records
  const kpis = useMemo(() => calculateOverallKPIs(matches), [matches]);

  // Filter matches for the trend chart
  const chartMatches = useMemo(() => {
    let sliced = [...matches];
    if (matchCountFilter === '5') sliced = sliced.slice(0, 5);
    else if (matchCountFilter === '10') sliced = sliced.slice(0, 10);
    else if (matchCountFilter === '20') sliced = sliced.slice(0, 20);

    // Reverse for chronological left-to-right display on chart
    return sliced.reverse().map((m, idx) => ({
      idx: idx + 1,
      opponent: m.opponent.replace('Super Giants', 'LSG').replace('Kings', 'CSK').replace('Titans', 'GT').replace('Knights', 'KKR').replace('Capitals', 'DC').replace('Blasters', 'RCB'),
      date: m.date.slice(5),
      runs: m.runs,
      balls: m.balls,
      strikeRate: m.strikeRate,
      wickets: m.wickets,
      economy: m.oversBowled > 0 ? m.economy : 0,
      rating: m.performanceRating,
      fullOpponent: m.opponent,
    }));
  }, [matches, matchCountFilter]);

  // Trend Badge styling
  const trendConfig = {
    Excellent: { label: '🔥 Excellent Form', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    Improving: { label: '🟢 Improving Form', color: 'bg-teal-500/10 text-teal-400 border-teal-500/30' },
    Stable: { label: '🟡 Stable Form', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    Declining: { label: '🔴 Declining Form', color: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
  };

  const currentTrend = trendConfig[kpis.formTrend] || trendConfig.Excellent;

  // Custom Dark Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl bg-slate-900/95 border border-slate-700/80 p-3 shadow-2xl backdrop-blur-md">
          <p className="text-xs font-bold text-white mb-1">vs {data.fullOpponent} ({data.date})</p>
          <div className="space-y-1 text-xs">
            <p className="text-emerald-400 font-semibold font-mono">Runs: {data.runs} ({data.balls} balls)</p>
            <p className="text-cyan-400 font-semibold font-mono">Strike Rate: {data.strikeRate}</p>
            {data.wickets > 0 && <p className="text-amber-400 font-semibold font-mono">Wickets: {data.wickets} (Econ: {data.economy})</p>}
            <p className="text-slate-400 text-[11px]">Match Rating: <span className="text-white font-bold">{data.rating}/10</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Top Greeting & Form Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Good evening, {user?.name ? user.name.split(' ')[0] : 'Arijit'} 👋
            </h1>
            <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${currentTrend.color}`}>
              {currentTrend.label}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Here's your comprehensive performance overview for <span className="text-slate-200 font-semibold">{activePlayer.name} ({activePlayer.team})</span>.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToCoach}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-emerald-400" />
            <span>AI Coach Debrief</span>
          </button>
          <button
            onClick={onNavigateToPrediction}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Target className="h-4 w-4 stroke-[2.5]" />
            <span>Next Match Simulation</span>
          </button>
        </div>
      </div>

      {/* 8 Core KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          title="Matches Played"
          value={kpis.matches}
          subtitle="All formats included"
          icon={Calendar}
          badge="Active Season"
          badgeColor="emerald"
        />
        <StatCard
          title="Total Runs"
          value={kpis.runs}
          change={kpis.prevPeriodChanges.runsDeltaPct}
          changeLabel="vs previous half"
          icon={TrendingUp}
          badge="Top Scorer"
          badgeColor="cyan"
          onClick={onNavigateToBatting}
        />
        <StatCard
          title="Batting Average"
          value={kpis.battingAverage}
          change={kpis.prevPeriodChanges.avgDeltaPct}
          changeLabel="+36% last 5 innings"
          icon={Award}
          badge="Elite Tier"
          badgeColor="emerald"
          onClick={onNavigateToBatting}
        />
        <StatCard
          title="Strike Rate"
          value={kpis.strikeRate}
          change={kpis.prevPeriodChanges.srDeltaPct}
          changeLabel="148.6 middle overs"
          icon={Zap}
          badge="Power Hitter"
          badgeColor="amber"
          onClick={onNavigateToBatting}
        />
        <StatCard
          title="Wickets Taken"
          value={kpis.wickets}
          subtitle={`Econ: ${kpis.economy} rpo`}
          icon={Activity}
          badge="Medium Pace"
          badgeColor="purple"
          onClick={onNavigateToBowling}
        />
        <StatCard
          title="Best Score"
          value={kpis.bestScore}
          subtitle="vs Delhi Capitals (52b)"
          icon={Target}
          badge="Match MVP"
          badgeColor="cyan"
        />
        <StatCard
          title="Form Score"
          value={`${kpis.formScore}/100`}
          change={kpis.prevPeriodChanges.formDeltaPct}
          changeLabel="Surging trajectory"
          icon={Flame}
          badge={kpis.formTrend}
          badgeColor={kpis.formTrend === 'Excellent' ? 'emerald' : 'cyan'}
        />
        <StatCard
          title="Consistency Score"
          value={`${kpis.consistencyScore}/100`}
          change={kpis.prevPeriodChanges.consistencyDeltaPct}
          changeLabel="Low variance coefficient"
          icon={Layers}
          badge="High Reliability"
          badgeColor="emerald"
        />
      </div>

      {/* Large Interactive Performance Chart */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">Performance Trajectory & Match Trends</h3>
              <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Interactive
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visualize metric fluctuations across consecutive competitive matches.
            </p>
          </div>

          {/* Controls: Metric selector & Match slice filter */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Metric toggles */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setActiveMetric('runs')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeMetric === 'runs' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Runs
              </button>
              <button
                onClick={() => setActiveMetric('strikeRate')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeMetric === 'strikeRate' ? 'bg-cyan-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Strike Rate
              </button>
              <button
                onClick={() => setActiveMetric('wickets')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  activeMetric === 'wickets' ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                Wickets
              </button>
            </div>

            {/* Match range selector */}
            <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
              <button
                onClick={() => setMatchCountFilter('5')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  matchCountFilter === '5' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Last 5
              </button>
              <button
                onClick={() => setMatchCountFilter('10')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  matchCountFilter === '10' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Last 10
              </button>
              <button
                onClick={() => setMatchCountFilter('20')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg ${
                  matchCountFilter === '20' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All 20
              </button>
            </div>
          </div>
        </div>

        {/* Recharts Area Container */}
        <div className="h-72 sm:h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartMatches} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="runsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="srGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="wktGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="opponent" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={activeMetric === 'strikeRate' ? [80, 200] : [0, 'auto']} />
              <Tooltip content={<CustomTooltip />} />
              {activeMetric === 'runs' && (
                <Area
                  type="monotone"
                  dataKey="runs"
                  name="Runs Scored"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#runsGrad)"
                />
              )}
              {activeMetric === 'strikeRate' && (
                <Area
                  type="monotone"
                  dataKey="strikeRate"
                  name="Strike Rate"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#srGrad)"
                />
              )}
              {activeMetric === 'wickets' && (
                <Area
                  type="monotone"
                  dataKey="wickets"
                  name="Wickets Taken"
                  stroke="#f59e0b"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#wktGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Layout: Recent Matches & AI Intel Snapshot */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Matches Table/Cards (2 cols) */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Recent Match Log & Ratings</h3>
              <p className="text-xs text-slate-400">Click any match to open detailed scorecard & tactical debrief.</p>
            </div>
            <button
              onClick={onNavigateToBatting}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/60">
            {matches.slice(0, 5).map((match) => (
              <div
                key={match.id}
                onClick={() => onSelectMatch(match)}
                className="py-3.5 px-2 hover:bg-slate-800/40 rounded-2xl cursor-pointer transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Match Opponent & Details */}
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 px-2.5 py-1 rounded-xl text-[11px] font-black uppercase ${
                    match.result === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {match.result}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                        vs {match.opponent}
                      </p>
                      <span className="text-[11px] text-slate-400">• {match.format}</span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {match.date} • {match.venue.split(',')[0]}
                    </p>
                  </div>
                </div>

                {/* Score & Rating */}
                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <p className="text-sm font-extrabold text-white font-mono">
                      {match.runs} <span className="text-xs font-normal text-slate-400">({match.balls})</span>
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      SR {match.strikeRate} • {match.fours}x4, {match.sixes}x6
                    </p>
                  </div>

                  <div className="px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-center min-w-[70px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Rating</span>
                    <span className="text-xs font-black text-emerald-400 font-mono">{match.performanceRating}/10</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: AI Intelligence & Opponent Preview (1 col) */}
        <div className="space-y-6">
          {/* AI Intelligence Spotlight Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Intelligence Focus</span>
            </div>
            <h4 className="text-base font-bold text-white mb-2">Middle Overs Dominance</h4>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Your recent form is accelerating (+36% average). Strike rate in overs 7–15 is 148.6. Maintain soft-hands rotation against left-arm spin.
            </p>
            <button
              onClick={onNavigateToCoach}
              className="w-full py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <span>Ask Coach About Spin Defense</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Upcoming Match Preview Card */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Next Match Simulation</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">82% Confidence</span>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className="text-sm font-extrabold text-white">vs Mumbai Titans</p>
                <p className="text-xs text-slate-400">Wankhede Stadium • Flat Track</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block">Expected Runs</span>
                <span className="text-sm font-black text-emerald-400 font-mono">48–65</span>
              </div>
            </div>

            <button
              onClick={onNavigateToPrediction}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>View Tactical Scouting Report</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
