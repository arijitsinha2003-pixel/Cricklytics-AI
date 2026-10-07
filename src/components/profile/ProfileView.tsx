import React from 'react';
import { Award, ShieldCheck, Zap, Target, Flame, Activity, Sparkles, MapPin, Calendar, Layers, Printer, Share2 } from 'lucide-react';
import { PlayerProfile, MatchRecord } from '../../types/cricket';
import { calculateBattingStats, calculateBowlingStats, calculateFormScore, calculateConsistencyScore } from '../../utils/analyticsEngine';
import { useToast } from '../ui/Toast';

interface ProfileViewProps {
  player: PlayerProfile;
  matches: MatchRecord[];
  onAskCoach: (topic: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ player, matches, onAskCoach }) => {
  const batting = calculateBattingStats(matches);
  const bowling = calculateBowlingStats(matches);
  const form = calculateFormScore(matches);
  const consistency = calculateConsistencyScore(matches);
  const { showToast } = useToast();

  const overallRating = Math.round(
    (player.radar.batting * 0.25) +
    (player.radar.consistency * 0.2) +
    (player.radar.power * 0.15) +
    (player.radar.technique * 0.15) +
    (player.radar.fitness * 0.15) +
    (player.radar.clutch * 0.1)
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Profile Link Copied', 'Scout report URL copied to clipboard.', 'info');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Player Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center gap-5">
            <img
              src={player.avatar}
              alt={player.name}
              className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl object-cover ring-4 ring-emerald-500/40 shadow-2xl"
            />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">{player.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-black">
                  #{player.jerseyNumber}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-300">{player.role} • {player.team}</p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-2">
                <span>🏏 {player.battingStyle}</span>
                <span>•</span>
                <span>🎯 {player.bowlingStyle}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {player.homeGround}</span>
              </div>
            </div>
          </div>

          {/* Right Action buttons & Overall Rating */}
          <div className="flex items-center gap-4">
            <div className="p-4 rounded-3xl bg-slate-950 border border-emerald-500/30 text-center min-w-[120px] shadow-lg">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-widest">Player Rating</span>
              <span className="text-3xl font-black text-emerald-400 font-mono">{overallRating}</span>
              <span className="text-[10px] font-bold text-emerald-500 block">PRO ELITE</span>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={handleShare}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="Share Profile"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                title="Print Report"
              >
                <Printer className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Sub-Rating Attribute Bars */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white pb-3 border-b border-slate-800">
          Biomechanical & Performance Attributes (0–100)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          {Object.entries(player.radar).map(([attr, score]) => (
            <div key={attr} className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="capitalize font-bold text-slate-200">{attr} Mastery</span>
                <span className="font-mono font-bold text-emerald-400">{score}/100</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Statistics Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Batting Career */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Award className="h-5 w-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Career Batting Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Total Runs</span>
              <span className="text-xl font-black text-white font-mono">{batting.runs}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Batting Average</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{batting.average}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Strike Rate</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{batting.strikeRate}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Highest Score</span>
              <span className="text-xl font-black text-white font-mono">{batting.highScore}*</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Fifties / Hundreds</span>
              <span className="text-xl font-black text-white font-mono">{batting.fifties} / {batting.hundreds}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Boundaries</span>
              <span className="text-xl font-black text-amber-400 font-mono">{batting.fours + batting.sixes}</span>
            </div>
          </div>
        </div>

        {/* Bowling Career */}
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Zap className="h-5 w-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Career Bowling Summary</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Wickets Taken</span>
              <span className="text-xl font-black text-white font-mono">{bowling.wickets}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Economy Rate</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{bowling.economy}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Best Figures</span>
              <span className="text-xl font-black text-amber-400 font-mono">{bowling.bestBowling}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Bowling Average</span>
              <span className="text-xl font-black text-white font-mono">{bowling.bowlingAverage}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Overs Bowled</span>
              <span className="text-xl font-black text-white font-mono">{bowling.overs}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
              <span className="text-slate-400 block">Dot Ball %</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{bowling.dotBallPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
