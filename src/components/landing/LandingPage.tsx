import React from 'react';
import {
  TrendingUp,
  Sparkles,
  Zap,
  Target,
  ShieldCheck,
  BarChart3,
  Bot,
  Users,
  Dumbbell,
  CheckCircle2,
  ArrowRight,
  Flame,
  Award,
  ChevronRight
} from 'lucide-react';
import { DEFAULT_PLAYER, INITIAL_MATCHES } from '../../data/mockCricketData';
import { calculateBattingStats, calculateFormScore } from '../../utils/analyticsEngine';

interface LandingPageProps {
  onEnterDashboard: () => void;
  onExploreDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterDashboard, onExploreDemo }) => {
  const batting = calculateBattingStats(INITIAL_MATCHES);
  const form = calculateFormScore(INITIAL_MATCHES);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Navbar for Landing */}
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black text-xl shadow-lg shadow-emerald-500/25">
              🏏
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-white">
                Cricklytics <span className="text-emerald-400 font-extrabold">AI</span>
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Next-Gen Sports Tech
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onExploreDemo}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer"
            >
              Explore Demo
            </button>
            <button
              onClick={onEnterDashboard}
              className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-950 bg-emerald-500 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden">
        {/* Background glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-6 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span>AI-Powered Cricket Performance Intelligence</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Turn Cricket Data Into <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Better Performance.
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">
              Analyze your game, discover your strengths, identify weaknesses, and train smarter with AI-powered cricket analytics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={onEnterDashboard}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-base font-extrabold shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-3 cursor-pointer"
              >
                <Zap className="h-5 w-5 fill-slate-950" />
                <span>Analyze Performance</span>
              </button>
              <button
                onClick={onExploreDemo}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 text-base font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Explore Demo (Arjun Sharma)</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hero Visual Dashboard Preview Card */}
          <div className="relative mx-auto max-w-5xl rounded-3xl bg-gradient-to-b from-slate-900/95 to-slate-950 border border-slate-800 p-4 sm:p-7 shadow-2xl shadow-emerald-950/40">
            {/* Top Bar of Preview */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <img
                  src={DEFAULT_PLAYER.avatar}
                  alt={DEFAULT_PLAYER.name}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-emerald-500/40 shadow-lg"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">{DEFAULT_PLAYER.name}</h3>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-500/20">
                      PRO ATHLETE
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{DEFAULT_PLAYER.role} • {DEFAULT_PLAYER.team} • Jersey #18</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-300">Form Score:</span>
                  <span className="text-sm font-extrabold text-emerald-400">{form.score}/100</span>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                  🔥 Excellent Trend
                </div>
              </div>
            </div>

            {/* Quick KPI Strip in Hero Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Career Runs</p>
                <p className="text-2xl font-black text-white mt-1 font-mono">{batting.runs}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">+12.5% vs prev season</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Batting Average</p>
                <p className="text-2xl font-black text-white mt-1 font-mono">{batting.average}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">Top 5% percentile</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Strike Rate</p>
                <p className="text-2xl font-black text-white mt-1 font-mono">{batting.strikeRate}</p>
                <p className="text-[10px] text-emerald-400 font-semibold mt-0.5">148.6 in Middle Overs</p>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Recent Best</p>
                <p className="text-2xl font-black text-white mt-1 font-mono">{batting.highScore}*</p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">vs Delhi Capitals</p>
              </div>
            </div>

            {/* AI Insight Card in Preview */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/50 via-slate-900 to-cyan-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">AI Intelligence Diagnostic</span>
                    <span className="text-[10px] text-slate-400">96% Confidence</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 mt-0.5 font-medium">
                    "Your recent form is improving. You have increased your average from 31.4 to 42.7 over your last 5 matches with exceptional middle-overs acceleration."
                  </p>
                </div>
              </div>
              <button
                onClick={onExploreDemo}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold whitespace-nowrap transition-colors"
              >
                View Full Analysis
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Cricklytics AI Section */}
      <section className="py-20 border-t border-slate-900 bg-slate-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Why Cricklytics AI?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              Built for Modern Cricketers Who Want Results
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mt-3">
              Traditional scorecards tell you what happened. Cricklytics AI tells you why it happened and what to do next.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <BarChart3 className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Phase & Wagon Wheel Analytics</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Break down your innings across Powerplay (1-6), Middle Overs (7-15), and Death Overs (16-20). Visualize your boundary scoring zones on an interactive 360° wagon wheel.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Bot className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Cricket Coach & Insights</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Receive automated diagnostics identifying your technical weaknesses (such as LBWs against incoming spin) and get real-time conversational coaching.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all group">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ML Match Predictor & Drills</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Predict your next match performance ranges across pitch types, opponents, and venues. Automatically translate diagnostic gaps into targeted weekly training drills.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="py-20 border-t border-slate-900 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight">
              A Complete Sports Analytics Stack
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400"><TrendingUp className="h-5 w-5" /></div>
                <h4 className="text-base font-bold text-white">Batting Intelligence</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Track conversion rate, dot ball percentage, boundary frequency, dismissal types, and strike rate acceleration trends.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400"><Zap className="h-5 w-5" /></div>
                <h4 className="text-base font-bold text-white">Bowling Mastery</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Analyze economy by phase, dot ball frequency, wicket-taking strike rates, and variations impact.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400"><Users className="h-5 w-5" /></div>
                <h4 className="text-base font-bold text-white">Player Comparison Radar</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Compare players across 6 dimensions: Batting, Consistency, Power, Technique, Fitness, and Clutch capability.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400"><Target className="h-5 w-5" /></div>
                <h4 className="text-base font-bold text-white">Dismissal Diagnostics</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Breakdown between Bowled, Caught, LBW, Run Out, and Stumped against Pace vs Spin bowling types.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400"><Dumbbell className="h-5 w-5" /></div>
                <h4 className="text-base font-bold text-white">Personalized Training Plans</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Weekly curated regimens across Batting, Bowling, Fitness, Mental Game, and Fielding with progress tracking.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400"><ShieldCheck className="h-5 w-5" /></div>
                <h4 className="text-base font-bold text-white">CSV Data Import & Export</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Easily import match scorecards via CSV, validate inputs, or export your full dataset anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-20 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-800 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight mb-6">
            Ready to elevate your cricket game with AI?
          </h2>
          <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto mb-8">
            Experience next-generation cricket performance intelligence. No setup required.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onEnterDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-base shadow-xl shadow-emerald-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Cricklytics AI</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={onExploreDemo}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-bold text-base transition-all cursor-pointer"
            >
              <span>Explore Demo Profile</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-slate-800 bg-slate-950 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Cricklytics AI</span>
            <span>• Next-Gen Cricket Analytics & Intelligence</span>
          </div>
          <p>© 2026 Cricklytics AI. Crafted for elite cricketers & coaches.</p>
        </div>
      </footer>
    </div>
  );
};
