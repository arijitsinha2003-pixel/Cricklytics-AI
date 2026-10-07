import React from 'react';
import { X, Calendar, MapPin, Award, Zap, Flame, ShieldAlert, Sparkles, Activity } from 'lucide-react';
import { MatchRecord } from '../../types/cricket';
import { WagonWheelChart } from '../ui/WagonWheelChart';

interface MatchDetailModalProps {
  match: MatchRecord | null;
  onClose: () => void;
  onAskCoachAboutMatch: (match: MatchRecord) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  onAskCoachAboutMatch,
}) => {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-6 sm:p-8 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Match Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase ${
                match.result === 'Won' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
              }`}>
                {match.result}
              </span>
              <span className="text-xs text-slate-400 font-semibold">• {match.format} Match</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">vs {match.opponent}</h2>
            <div className="flex items-center gap-4 text-xs text-slate-400 mt-1">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {match.date}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {match.venue}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Match Rating</span>
              <span className="text-xl font-black text-emerald-400 font-mono">{match.performanceRating}/10</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center min-w-[90px]">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">MVP Points</span>
              <span className="text-xl font-black text-cyan-400 font-mono">{match.mvpPoints}</span>
            </div>
          </div>
        </div>

        {/* Scorecard Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Runs Scored</span>
            <span className="text-2xl font-black text-white font-mono">{match.runs}</span>
            <span className="text-[10px] text-slate-400 block">off {match.balls} balls</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Strike Rate</span>
            <span className="text-2xl font-black text-cyan-400 font-mono">{match.strikeRate}</span>
            <span className="text-[10px] text-slate-400 block">{match.dotBalls} dot balls</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Boundaries</span>
            <span className="text-2xl font-black text-amber-400 font-mono">{match.fours + match.sixes}</span>
            <span className="text-[10px] text-slate-400 block">{match.fours} fours, {match.sixes} sixes</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Dismissal</span>
            <span className="text-base font-bold text-rose-400 mt-1 block">{match.dismissal}</span>
            <span className="text-[10px] text-slate-400 block">Bowler: {match.dismissalBowlerType || 'N/A'}</span>
          </div>
        </div>

        {/* Bowling Figures if available */}
        {match.oversBowled > 0 && (
          <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-bold text-white">Bowling Figures:</span>
              <span className="text-xs font-mono text-slate-300">
                {match.oversBowled} overs • {match.runsConceded} runs • <strong className="text-emerald-400">{match.wickets} wickets</strong>
              </span>
            </div>
            <span className="text-xs font-mono text-amber-400 font-semibold">Economy: {match.economy} rpo</span>
          </div>
        )}

        {/* Innings Phase Table */}
        <div className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800 mb-6 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Innings Phase Breakdown</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Powerplay (1-6)</span>
              <span className="font-bold text-white font-mono">{match.phase.powerplay.runs} ({match.phase.powerplay.balls}b)</span>
              <span className="text-[10px] text-slate-400 block">{match.phase.powerplay.fours}x4, {match.phase.powerplay.sixes}x6</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Middle (7-15)</span>
              <span className="font-bold text-white font-mono">{match.phase.middle.runs} ({match.phase.middle.balls}b)</span>
              <span className="text-[10px] text-slate-400 block">{match.phase.middle.fours}x4, {match.phase.middle.sixes}x6</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Death (16-20)</span>
              <span className="font-bold text-white font-mono">{match.phase.death.runs} ({match.phase.death.balls}b)</span>
              <span className="text-[10px] text-slate-400 block">{match.phase.death.fours}x4, {match.phase.death.sixes}x6</span>
            </div>
          </div>
        </div>

        {/* Wagon Wheel in Match Modal */}
        <div className="mb-6 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Match Scoring Wagon Wheel</h4>
          <WagonWheelChart data={match.wagonWheel} totalRuns={match.runs} />
        </div>

        {/* Tactical Notes & AI Action */}
        {match.notes && (
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-slate-300 mb-6">
            <strong className="text-emerald-400 block mb-1">Coach Notes & Tactical Debrief:</strong>
            <p>{match.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={() => {
              onAskCoachAboutMatch(match);
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Ask AI Coach to Analyze This Match</span>
          </button>
        </div>
      </div>
    </div>
  );
};
