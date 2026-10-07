import React, { useState } from 'react';
import { Search, Bell, Plus, User, LogOut, Sparkles, Menu, ShieldCheck, CheckCircle, ChevronDown } from 'lucide-react';
import { UserAccount, PlayerProfile } from '../../types/cricket';

interface NavbarProps {
  user: UserAccount | null;
  activePlayer: PlayerProfile;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddMatch: () => void;
  onToggleSidebar: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activePlayer,
  onOpenAuth,
  onLogout,
  onOpenAddMatch,
  onToggleSidebar,
  searchQuery,
  onSearchChange,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const notifications = [
    {
      id: 'n-1',
      title: 'Form Surge Detected 🔥',
      desc: 'Batting average increased by +36.0% across last 5 matches.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'n-2',
      title: 'AI Gameplan Ready',
      desc: 'Simulation for upcoming clash vs Mumbai Titans is available.',
      time: '1h ago',
      unread: true,
    },
    {
      id: 'n-3',
      title: 'Weekly Drill Goal',
      desc: 'Completed Monday Spin Mastery footwork session.',
      time: '1d ago',
      unread: false,
    },
  ];

  return (
    <header className="sticky top-0 z-30 h-16 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-4 sm:px-6">
      <div className="flex h-full items-center justify-between gap-4">
        {/* Left: Mobile menu button & Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search box */}
          <div className="relative w-full max-w-sm hidden sm:block">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search matches, venues, tactics..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl bg-slate-900/90 border border-slate-800/90 py-2 pl-9 pr-4 text-xs text-white placeholder-slate-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Quick Add Match Button */}
          <button
            onClick={onOpenAddMatch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Log Match</span>
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-slate-950" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-4 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Alerts & AI Intel</h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-semibold">2 New</span>
                </div>
                <div className="divide-y divide-slate-800/60 mt-1 max-h-64 overflow-y-auto">
                  {notifications.map((n) => (
                    <div key={n.id} className="py-2.5 hover:bg-slate-800/40 rounded-lg px-1 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-3 py-1.5 text-center text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>

          {/* User Account / Sign In */}
          {user && user.isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 pl-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <img
                  src={activePlayer.avatar}
                  alt={activePlayer.name}
                  className="h-7 w-7 rounded-lg object-cover ring-1 ring-emerald-500/50"
                />
                <div className="text-left hidden md:block">
                  <p className="text-xs font-bold text-white leading-none">{activePlayer.name}</p>
                  <p className="text-[10px] text-emerald-400 font-semibold">{user.tier}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl p-2 z-50 animate-fadeIn">
                  <div className="p-2 border-b border-slate-800">
                    <p className="text-xs font-bold text-white">{user.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                      <ShieldCheck className="h-3 w-3" /> Pro Athlete Active
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2 p-2 mt-1 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-semibold transition-all cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-emerald-400" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
