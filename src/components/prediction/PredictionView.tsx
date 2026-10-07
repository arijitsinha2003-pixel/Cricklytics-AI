import React, { useState, useMemo } from 'react';
import { Target, Sparkles, TrendingUp, ShieldCheck, Activity, Compass, AlertCircle, ArrowRight } from 'lucide-react';
import { MatchRecord, PlayerProfile, NextMatchPrediction } from '../../types/cricket';
import { runPerformancePredictionModel } from '../../utils/analyticsEngine';

interface PredictionViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
  onAskCoach: (topic: string) => void;
}

export const PredictionView: React.FC<PredictionViewProps> = ({
  matches,
  activePlayer,
  onAskCoach,
}) => {
  const [opponent, setOpponent] = useState('Mumbai Titans');
  const [pitchType, setPitchType] = useState<'Flat / Batting Friendly' | 'Green Seamer' | 'Dry Turning Track' | 'Slow & Low'>('Flat / Batting Friendly');
  const [venue, setVenue] = useState('Wankhede Stadium, Mumbai');

  const opponentsList = [
    'Mumbai Titans',
    'Kolkata Knights',
    'Chennai Kings',
    'Delhi Capitals',
    'Bangalore Blasters',
    'Gujarat Giants',
    'Punjab Lions',
    'Hyderabad Sunrisers',
    'Rajasthan Royals',
    'Lucknow Super Giants'
  ];

  const prediction = useMemo(() => {
    return runPerformancePredictionModel(matches, opponent, pitchType, venue);
  }, [matches, opponent, pitchType, venue]);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black text-white tracking-tight">ML Match Predictor & Tactical Simulator</h1>
          <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
            Bayesian Forecasting
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Probabilistic outcome ranges based on opponent bowling matrix, pitch condition variables, venue dimensions, and rolling player form.
        </p>
      </div>

      {/* Simulation Control Knobs */}
      <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl space-y-4">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulation Parameters</h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1">Target Opponent</label>
            <select
              value={opponent}
              onChange={(e) => setOpponent(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-semibold focus:border-emerald-500 focus:outline-none"
            >
              {opponentsList.map((opp) => (
                <option key={opp} value={opp}>{opp}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Pitch Surface & Behavior</label>
            <select
              value={pitchType}
              onChange={(e) => setPitchType(e.target.value as any)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-semibold focus:border-emerald-500 focus:outline-none"
            >
              <option value="Flat / Batting Friendly">Flat / Batting Friendly (High Bounce)</option>
              <option value="Green Seamer">Green Seamer (Early Seam Movement)</option>
              <option value="Dry Turning Track">Dry Turning Track (Heavy Spin Grip)</option>
              <option value="Slow & Low">Slow & Low (Sluggish Pitch)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Stadium / Venue</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-800 p-2.5 text-white font-semibold focus:border-emerald-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Prediction Output Results */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Forecast Output</span>
              <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                Confidence: {prediction.confidence}%
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
              Projected Output vs {prediction.opponent}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
              Venue: {prediction.venue.split(',')[0]}
            </span>
          </div>
        </div>

        {/* 4 Forecast KPIs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Expected Runs</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono block mt-1">
              {prediction.expectedRunsMin}–{prediction.expectedRunsMax}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Based on pace & spin matchups</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Expected Strike Rate</span>
            <span className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono block mt-1">
              {prediction.expectedStrikeRateMin}–{prediction.expectedStrikeRateMax}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Middle overs surge factored</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Performance Probability</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-400 font-mono block mt-1">
              {prediction.probabilityStrongForm}%
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Rating &gt; 8.0 likelihood</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400 uppercase block">Fifty+ Score Chance</span>
            <span className="text-2xl sm:text-3xl font-black text-purple-400 font-mono block mt-1">
              {prediction.probabilityFiftyPlus}%
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">Milestone conversion odds</span>
          </div>
        </div>

        {/* Key Matchup Insight & Tactical Gameplan */}
        <div className="space-y-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-emerald-400" />
              <span>Opponent Scouting & Matchup Profile</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {prediction.keyMatchupInsight}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Target className="h-4 w-4 text-cyan-400" />
              <span>AI Tactical Gameplan</span>
            </h4>
            <div className="space-y-2">
              {prediction.tacticalGameplan.map((plan, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-300">
                  <span className="flex h-5 w-5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black items-center justify-center flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{plan}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action button to discuss with coach */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-slate-400">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>Predictions are machine-learning statistical models for training preparation.</span>
          </div>
          <button
            onClick={() => onAskCoach(`Coach, prepare me for the upcoming match vs ${prediction.opponent} on a ${pitchType} pitch.`)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="h-4 w-4" />
            <span>Review Tactical Drills with AI Coach</span>
          </button>
        </div>
      </div>
    </div>
  );
};
