import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { Zap, Activity, Award, ShieldCheck, Target, TrendingUp } from 'lucide-react';
import { MatchRecord, PlayerProfile } from '../../types/cricket';
import { calculateBowlingStats } from '../../utils/analyticsEngine';
import { StatCard } from '../ui/StatCard';

interface BowlingAnalyticsViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
}

export const BowlingAnalyticsView: React.FC<BowlingAnalyticsViewProps> = ({ matches, activePlayer }) => {
  const stats = useMemo(() => calculateBowlingStats(matches), [matches]);

  const bowlingMatchesData = useMemo(() => {
    return matches
      .filter((m) => m.oversBowled > 0)
      .reverse()
      .map((m, idx) => ({
        matchNumber: `M${idx + 1}`,
        opponent: m.opponent.slice(0, 10),
        overs: m.oversBowled,
        runsConceded: m.runsConceded,
        wickets: m.wickets,
        economy: m.economy,
        dots: m.bowlingDotBalls,
      }));
  }, [matches]);

  // Phase breakdown for bowling
  const bowlingPhaseData = [
    { phase: 'Powerplay (1-6)', overs: 6, runsConceded: 48, wickets: 3, economy: 8.0, dotBallPct: 44 },
    { phase: 'Middle Overs (7-15)', overs: 38, runsConceded: 298, wickets: 12, economy: 7.84, dotBallPct: 48 },
    { phase: 'Death Overs (16-20)', overs: 3, runsConceded: 32, wickets: 0, economy: 10.67, dotBallPct: 22 },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">Bowling Analytics Engine</h1>
          <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            {activePlayer.bowlingStyle}
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Detailed metrics on overs, wicket-taking strike rates, economy control, and spell variations.
        </p>
      </div>

      {/* 6 Bowling Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <StatCard
          title="Total Wickets"
          value={stats.wickets}
          subtitle={`Best: ${stats.bestBowling}`}
          icon={Activity}
          badge="Middle Overs"
          badgeColor="amber"
        />
        <StatCard
          title="Economy Rate"
          value={stats.economy}
          subtitle={`${stats.runsConceded} Runs / ${stats.overs} Overs`}
          icon={Zap}
          badge="Controlled"
          badgeColor="emerald"
        />
        <StatCard
          title="Bowling Avg"
          value={stats.bowlingAverage}
          subtitle="Runs per wicket"
          icon={Award}
          badge="Effective"
          badgeColor="cyan"
        />
        <StatCard
          title="Strike Rate"
          value={stats.bowlingStrikeRate}
          subtitle="Balls per wicket"
          icon={Target}
          badge="Impact"
          badgeColor="purple"
        />
        <StatCard
          title="Dot Ball %"
          value={`${stats.dotBallPercentage}%`}
          subtitle={`${stats.dotBalls} Dot Balls`}
          icon={ShieldCheck}
          badge="Pressure"
          badgeColor="emerald"
        />
        <StatCard
          title="Overs Bowled"
          value={stats.overs}
          subtitle={`${stats.maidens} Maidens`}
          icon={TrendingUp}
          badge="Regular Option"
          badgeColor="cyan"
        />
      </div>

      {/* Bowling Phase Breakdown */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-white">Bowling Phase Breakdown</h3>
            <p className="text-xs text-slate-400">Effectiveness across Powerplay, Middle, and Death overs.</p>
          </div>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
            Primary Middle Enforcer (7.84 Econ)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {bowlingPhaseData.map((phase) => (
            <div key={phase.phase} className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">{phase.phase}</span>
                <span className="text-xs font-black text-amber-400 font-mono">{phase.wickets} Wickets</span>
              </div>
              <div className="space-y-1.5 text-xs text-slate-400">
                <div className="flex justify-between">
                  <span>Overs Bowled:</span>
                  <span className="font-bold text-white font-mono">{phase.overs} overs</span>
                </div>
                <div className="flex justify-between">
                  <span>Runs Conceded:</span>
                  <span className="font-semibold text-slate-200">{phase.runsConceded}</span>
                </div>
                <div className="flex justify-between">
                  <span>Economy Rate:</span>
                  <span className="font-bold text-emerald-400 font-mono">{phase.economy} rpo</span>
                </div>
                <div className="flex justify-between">
                  <span>Dot Ball %:</span>
                  <span className="font-semibold text-slate-200">{phase.dotBallPct}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wickets & Economy Charts Dual Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wickets By Match Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Wickets Per Match</h3>
              <p className="text-xs text-slate-400">Wicket breakthroughs across competitive games.</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bowlingMatchesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="matchNumber" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="wickets" name="Wickets" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Economy Rate Trend Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-base font-bold text-white">Economy Rate Trend</h3>
              <p className="text-xs text-slate-400">Runs conceded per over per match.</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={bowlingMatchesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="matchNumber" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="economy" name="Economy (RPO)" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
