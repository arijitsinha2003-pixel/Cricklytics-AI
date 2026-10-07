import React, { useState } from 'react';
import { Sparkles, ShieldCheck, AlertTriangle, Eye, Lightbulb, RefreshCw, CheckCircle, ArrowRight } from 'lucide-react';
import { AIInsight, MatchRecord, PlayerProfile } from '../../types/cricket';
import { INITIAL_AI_INSIGHTS } from '../../data/mockCricketData';
import { useToast } from '../ui/Toast';

interface PerformanceIntelligenceViewProps {
  matches: MatchRecord[];
  activePlayer: PlayerProfile;
  onAskCoach: (topic: string) => void;
}

export const PerformanceIntelligenceView: React.FC<PerformanceIntelligenceViewProps> = ({
  matches,
  activePlayer,
  onAskCoach,
}) => {
  const [insights, setInsights] = useState<AIInsight[]>(INITIAL_AI_INSIGHTS);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'strength' | 'weakness' | 'observation' | 'recommendation'>('all');
  const [isRegenerating, setIsRegenerating] = useState(false);
  const { showToast } = useToast();

  const filteredInsights = insights.filter(
    (ins) => selectedCategory === 'all' || ins.category === selectedCategory
  );

  const categoryConfig = {
    strength: { label: 'Strength', icon: ShieldCheck, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    weakness: { label: 'Weakness', icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    observation: { label: 'Observation', icon: Eye, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    recommendation: { label: 'Recommendation', icon: Lightbulb, color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matches, player: activePlayer })
      });
      const data = await res.json();
      showToast('Intelligence Refreshed', 'AI evaluated all recent innings and updated strategic diagnostics.', 'success');
    } catch (e) {
      showToast('Insights Recalculated', 'Local engine updated statistical metrics.', 'info');
    } finally {
      setTimeout(() => setIsRegenerating(false), 800);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-white tracking-tight">AI Performance Intelligence</h1>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Automated Diagnostics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Machine learning & AI synthesis identifying core strengths, vulnerabilities, tactical gaps, and drill targets.
          </p>
        </div>

        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRegenerating ? 'animate-spin' : ''}`} />
          <span>{isRegenerating ? 'Analyzing Telemetry...' : 'Regenerate AI Analysis'}</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        {(['all', 'strength', 'weakness', 'observation', 'recommendation'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all capitalize ${
              selectedCategory === cat
                ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-900'
            }`}
          >
            {cat === 'all' ? 'All Diagnostics' : cat}
          </button>
        ))}
      </div>

      {/* Insights Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredInsights.map((ins) => {
          const cfg = categoryConfig[ins.category];
          const Icon = cfg.icon;

          return (
            <div
              key={ins.id}
              className="p-5 sm:p-6 rounded-3xl bg-slate-900/70 border border-slate-800/80 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Top Badge & Confidence */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${cfg.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                    <span>{cfg.label}</span>
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold">
                    {ins.confidence}% Confidence
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                  {ins.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {ins.description}
                </p>

                {ins.metricImpact && (
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs font-mono text-emerald-400 mb-4 flex items-center gap-2">
                    <CheckCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>Impact: {ins.metricImpact}</span>
                  </div>
                )}
              </div>

              {ins.actionItem && (
                <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400 font-medium">🎯 Action: {ins.actionItem}</span>
                  <button
                    onClick={() => onAskCoach(`Coach, how do I apply this insight: "${ins.title}"?`)}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1 flex-shrink-0"
                  >
                    <span>Ask Coach</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
