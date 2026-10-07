import React, { useState } from 'react';
import { Sidebar, NavView } from './Sidebar';
import { Navbar } from './Navbar';
import { UserAccount, PlayerProfile, MatchRecord } from '../../types/cricket';
import { calculateFormScore } from '../../utils/analyticsEngine';

interface AppLayoutProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  user: UserAccount | null;
  activePlayer: PlayerProfile;
  matches: MatchRecord[];
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAddMatch: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentView,
  onNavigate,
  user,
  activePlayer,
  matches,
  onOpenAuth,
  onLogout,
  onOpenAddMatch,
  searchQuery,
  onSearchChange,
  children,
}) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const form = calculateFormScore(matches);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Sidebar (Desktop permanent, Mobile drawer) */}
      <Sidebar
        currentView={currentView}
        onNavigate={onNavigate}
        isOpenMobile={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
        activePlayer={activePlayer}
        formTrend={form.trend}
        formScore={form.score}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Sticky Top Navbar */}
        <Navbar
          user={user}
          activePlayer={activePlayer}
          onOpenAuth={onOpenAuth}
          onLogout={onLogout}
          onOpenAddMatch={onOpenAddMatch}
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />

        {/* Dynamic Page Views */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
