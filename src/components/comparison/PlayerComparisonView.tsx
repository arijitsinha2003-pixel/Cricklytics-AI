import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
  Tooltip
} from 'recharts';
import { Users, Sparkles, TrendingUp, Zap, Award, Target, Flame, ChevronRight } from 'lucide-react';
import { PlayerProfile, MatchRecord } from '../../types/cricket';
import { COMPARISON_PLAYERS } from '../../data/mockCricketData';
import { calculateBattingStats, calculateFormScore } from '../../utils/analyticsEngine';

interface PlayerComparisonViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
  onAskCoach: (topic: string) => void;
}

export const PlayerComparisonView: React.FC<PlayerComparisonViewProps> = ({
  matches,
  activePlayer,
  onAskCoach,
}) => {
  const [playerBId, setPlayerBId] = useState('p-2'); // Virat Nair by default

  const playerA = activePlayer;
  const playerB = useMemo(() => {
    return COMPARISON_PLAYERS.find((p) => p.id === playerBId) || COMPARISON_PLAYERS[1];
  }, [playerBId]);

  const statsA = useMemo(() => calculateBattingStats(matches), [matches]);
  const formA = useMemo(() => calculateFormScore(matches), [matches]);

  // Mock static stats for player B for high-fidelity head-to-head
  const statsBMap: Record<string, any> = {
    'p-2': { matches: 22, runs: 1045, avg: 52.2, sr: 134.5, high: '94*', boundaries: 112, wickets: 6, econ: 8.4, consistency: 93, form: 88 },
    'p-3': { matches: 18, runs: 780, avg: 39.0, sr: 168.2, high: '88', boundaries: 124, wickets: 4, econ: 9.8, consistency: 72, form: 84 },
    'p-4': { matches: 20, runs: 690, avg: 34.5, sr: 155.0, high: '74*', boundaries: 86, wickets: 24, econ: 7.6, consistency: 79, form: 86 },
  };

  const statsB = statsBMap[playerB.id] || statsBMap['p-2'];

  // Radar Data
  const radarData = [
    { subject: 'Batting', A: playerA.radar.batting, B: playerB.radar.batting, fullMark: 100 },
    { subject: 'Consistency', A: playerA.radar.consistency, B: playerB.radar.consistency, fullMark: 100 },
    { subject: 'Power', A: playerA.radar.power, B: playerB.radar.power, fullMark: 100 },
    { subject: 'Technique', A: playerA.radar.technique, B: playerB.radar.technique, fullMark: 100 },
    { subject: 'Fitness', A: playerA.radar.fitness, B: playerB.radar.fitness, fullMark: 100 },
    { subject: 'Clutch', A: playerA.radar.clutch, B: playerB.radar.clutch, fullMark: 100 },
  ];

  // Head to head comparison metrics
  const h2hMetrics = [
    { label: 'Batting Average', valA: statsA.average, valB: statsB.avg, unit: '', advantage: statsA.average >= statsB.avg ? 'A' : 'B' },
    { label: 'Strike Rate', valA: statsA.strikeRate, valB: statsB.sr, unit: '', advantage: statsA.strikeRate >= statsB.sr ? 'A' : 'B' },
    { label: 'Total Career Runs', valA: statsA.runs, valB: statsB.runs, unit: '', advantage: statsA.runs >= statsB.runs ? 'A' : 'B' },
    { label: 'High Score', valA: statsA.highScore, valB: parseInt(statsB.high), unit: '', advantage: statsA.highScore >= parseInt(statsB.high) ? 'A' : 'B' },
    { label: 'Boundaries (4s + 6s)', valA: statsA.fours + statsA.sixes, valB: statsB.boundaries, unit: '', advantage: (statsA.fours + statsA.sixes) >= statsB.boundaries ? 'A' : 'B' },
    { label: 'Wickets Taken', valA: 15, valB: statsB.wickets, unit: '', advantage: 15 >= statsB.wickets ? 'A' : 'B' },
    { label: 'Consistency Index', valA: playerA.radar.consistency, valB: statsB.consistency, unit: '/100', advantage: playerA.radar.consistency >= statsB.consistency ? 'A' : 'B' },
    { label: 'Recent Form Score', valA: formA.score, valB: statsB.form, unit: '/100', advantage: formA.score >= statsB.form ? 'A' : 'B' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">Player Comparison Hub</h1>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Head-to-Head Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare biometric attributes, career efficiency, consistency, and radar profiles against competition.
          </p>
        </div>

        {/* Player B Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Compare with:</span>
          <select
            value={playerBId}
            onChange={(e) => setPlayerBId(e.target.value)}
            className="rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-xs font-bold text-white focus:border-cyan-500 focus:outline-none"
          >
            {COMPARISON_PLAYERS.filter((p) => p.id !== playerA.id).map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.team})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Two Player Profiles Header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player A (Emerald) */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={playerA.avatar}
              alt={playerA.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-emerald-500 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{playerA.name}</h3>
                <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">
                  YOU
                </span>
              </div>
              <p className="text-xs text-slate-400">{playerA.role} • {playerA.team}</p>
              <p className="text-[11px] font-mono text-emerald-400 font-bold mt-1">
                Avg {statsA.average} • SR {statsA.strikeRate}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Form Rating</span>
            <span className="text-xl font-black text-emerald-400 font-mono">{formA.score}/100</span>
          </div>
        </div>

        {/* Player B (Cyan) */}
        <div className="p-5 rounded-3xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={playerB.avatar}
              alt={playerB.name}
              className="h-14 w-14 rounded-2xl object-cover ring-2 ring-cyan-500 shadow-lg"
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">{playerB.name}</h3>
                <span className="text-[10px] font-black bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded">
                  RIVAL
                </span>
              </div>
              <p className="text-xs text-slate-400">{playerB.role} • {playerB.team}</p>
              <p className="text-[11px] font-mono text-cyan-400 font-bold mt-1">
                Avg {statsB.avg} • SR {statsB.sr}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Form Rating</span>
            <span className="text-xl font-black text-cyan-400 font-mono">{statsB.form}/100</span>
          </div>
        </div>
      </div>

      {/* Radar Chart & AI Comparative Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hexagonal Radar Chart */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-white">Attribute Radar Comparison</h3>
            <span className="text-xs text-slate-400">6 Dimensions</span>
          </div>

          <div className="h-72 sm:h-80 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name={playerA.name} dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.35} />
                <Radar name={playerB.name} dataKey="B" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.25} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Comparative Summary Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/30 border border-cyan-500/20 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 mb-3">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">AI Comparative Intelligence</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">
              Tactical Synthesis: {playerA.name} vs {playerB.name}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
              {playerA.name} demonstrates superior **power hitting (91 vs {playerB.radar.power})** and higher **middle-overs strike acceleration (148.6)**, while {playerB.name} shows classical anchor consistency with a higher batting average ({statsB.avg}) and lower dismissal probability vs spin.
            </p>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-emerald-400 block mb-0.5">Where You Lead:</span>
                <span className="text-slate-300">Strike rate (+{(statsA.strikeRate - statsB.sr).toFixed(1)}), death overs power, bowling versatility (15 wickets).</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800">
                <span className="font-bold text-cyan-400 block mb-0.5">Where {playerB.name} Leads:</span>
                <span className="text-slate-300">Defensive technique vs spin, lower dot-ball rate on away venues.</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onAskCoach(`Coach, how do I bridge the technical gap between my game and ${playerB.name}'s anchor consistency?`)}
            className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Ask Coach for Comparative Drills</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Head to Head Metric Bars */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Head-to-Head Metric Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {h2hMetrics.map((m, idx) => (
            <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/50 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className={`font-mono font-bold ${m.advantage === 'A' ? 'text-emerald-400' : 'text-slate-400'}`}>
                  {m.valA}{m.unit}
                </span>
                <span className="font-semibold text-slate-300">{m.label}</span>
                <span className={`font-mono font-bold ${m.advantage === 'B' ? 'text-cyan-400' : 'text-slate-400'}`}>
                  {m.valB}{m.unit}
                </span>
              </div>

              {/* Comparative Dual Progress Bar */}
              <div className="flex h-2 w-full rounded-full bg-slate-900 overflow-hidden">
                <div
                  className="bg-emerald-500 transition-all duration-500 rounded-l-full"
                  style={{ width: `${(Number(m.valA) / (Number(m.valA) + Number(m.valB) || 1)) * 100}%` }}
                />
                <div
                  className="bg-cyan-500 transition-all duration-500 rounded-r-full"
                  style={{ width: `${(Number(m.valB) / (Number(m.valA) + Number(m.valB) || 1)) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
