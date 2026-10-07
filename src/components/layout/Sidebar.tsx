import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  History,
  PieChart,
  Bot,
  Users,
  Dumbbell,
  User,
  Settings,
  Sparkles,
  Zap,
  ChevronRight,
  Flame
} from 'lucide-react';
import { PlayerProfile } from '../../types/cricket';

export type NavView =
  | 'dashboard'
  | 'batting'
  | 'bowling'
  | 'matches'
  | 'analytics'
  | 'coach'
  | 'compare'
  | 'training'
  | 'profile'
  | 'settings';

interface SidebarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  activePlayer: PlayerProfile;
  formTrend?: string;
  formScore?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  isOpenMobile,
  onCloseMobile,
  activePlayer,
  formTrend = 'Excellent',
  formScore = 92
}) => {
  const navItems = [
    { id: 'dashboard' as NavView, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'batting' as NavView, label: 'Batting Analytics', icon: TrendingUp },
    { id: 'bowling' as NavView, label: 'Bowling Analytics', icon: Zap },
    { id: 'matches' as NavView, label: 'Match Records', icon: History, badge: '20' },
    { id: 'analytics' as NavView, label: 'Performance Intel', icon: PieChart, highlight: 'AI' },
    { id: 'coach' as NavView, label: 'AI Cricket Coach', icon: Bot, pulse: true },
    { id: 'compare' as NavView, label: 'Compare Players', icon: Users },
    { id: 'training' as NavView, label: 'Training Center', icon: Dumbbell, badge: '5 Drills' },
    { id: 'profile' as NavView, label: 'Player Profile', icon: User },
    { id: 'settings' as NavView, label: 'Settings', icon: Settings },
  ];

  const handleItemClick = (view: NavView) => {
    onNavigate(view);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Main Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 flex w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 p-4 backdrop-blur-2xl transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Logo */}
        <div className="flex items-center gap-3 px-2 py-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 font-black text-xl">
            🏏
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white">Cricklytics</span>
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">AI</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 tracking-wide">Pro Performance Engine</p>
          </div>
        </div>

        {/* Player Snapshot Chip */}
        <div className="mb-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800/60 border border-slate-800 p-3 shadow-inner">
          <div className="flex items-center gap-3">
            <img
              src={activePlayer.avatar}
              alt={activePlayer.name}
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-emerald-500/30"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white truncate">{activePlayer.name}</p>
              <p className="text-[10px] text-slate-400 truncate">{activePlayer.team}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400">
                  <Flame className="h-3 w-3 text-amber-400" /> Form {formScore}
                </span>
                <span className="text-[10px] text-slate-500">•</span>
                <span className="text-[10px] font-medium text-slate-300">#18</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 space-y-1 overflow-y-auto pr-1">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">Navigation</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`group relative flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-slate-950 stroke-[2.5]' : 'text-slate-400 group-hover:text-emerald-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.pulse && !isActive && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  )}
                  {item.highlight && !isActive && (
                    <span className="rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20">
                      {item.highlight}
                    </span>
                  )}
                  {item.badge && (
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${
                        isActive
                          ? 'bg-slate-950/20 text-slate-950'
                          : 'bg-slate-800 text-slate-400 border border-slate-700/60'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Pro AI Intelligence Badge */}
        <div className="mt-auto pt-3 border-t border-slate-800/80">
          <div className="rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-teal-950/30 border border-emerald-500/20 p-3">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <Sparkles className="h-4 w-4" />
              <span className="text-xs font-bold">AI Coach Active</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Real-time biomechanical and statistical models active for next match.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
