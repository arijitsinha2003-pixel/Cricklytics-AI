/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ToastProvider } from './components/ui/Toast';
import { AppLayout } from './components/layout/AppLayout';
import { NavView } from './components/layout/Sidebar';
import { LandingPage } from './components/landing/LandingPage';
import { OverviewView } from './components/dashboard/OverviewView';
import { BattingAnalyticsView } from './components/analytics/BattingAnalyticsView';
import { BowlingAnalyticsView } from './components/analytics/BowlingAnalyticsView';
import { MatchesView } from './components/matches/MatchesView';
import { PerformanceIntelligenceView } from './components/ai/PerformanceIntelligenceView';
import { AICoachView } from './components/ai/AICoachView';
import { PredictionView } from './components/prediction/PredictionView';
import { PlayerComparisonView } from './components/comparison/PlayerComparisonView';
import { TrainingView } from './components/training/TrainingView';
import { ProfileView } from './components/profile/ProfileView';
import { SettingsView } from './components/settings/SettingsView';
import { AuthModal } from './components/auth/AuthModal';
import { AddMatchModal } from './components/matches/AddMatchModal';
import { MatchDetailModal } from './components/matches/MatchDetailModal';
import { DEFAULT_PLAYER, INITIAL_MATCHES } from './data/mockCricketData';
import { MatchRecord, PlayerProfile, UserAccount } from './types/cricket';

export default function App() {
  const [pageMode, setPageMode] = useState<'landing' | 'app'>('app');
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [activePlayer, setActivePlayer] = useState<PlayerProfile>(DEFAULT_PLAYER);
  const [matches, setMatches] = useState<MatchRecord[]>(() => {
    try {
      const saved = localStorage.getItem('cricklytics_matches');
      return saved ? JSON.parse(saved) : INITIAL_MATCHES;
    } catch {
      return INITIAL_MATCHES;
    }
  });

  const [user, setUser] = useState<UserAccount | null>({
    id: 'user-arjun',
    name: 'Arijit Sinha',
    email: 'arijitsinha2003@gmail.com',
    avatar: DEFAULT_PLAYER.avatar,
    tier: 'Pro Athlete',
    isLoggedIn: true,
  });

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);
  const [coachPrompt, setCoachPrompt] = useState<string | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  // Persist matches to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('cricklytics_matches', JSON.stringify(matches));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [matches]);

  const handleAddMatch = (newMatch: MatchRecord) => {
    setMatches((prev) => [newMatch, ...prev]);
  };

  const handleBulkAddMatches = (newMatches: MatchRecord[]) => {
    setMatches((prev) => [...newMatches, ...prev]);
  };

  const handleAskCoach = (topic: string) => {
    setCoachPrompt(topic);
    setCurrentView('coach');
  };

  return (
    <ToastProvider>
      {pageMode === 'landing' ? (
        <LandingPage
          onEnterDashboard={() => setPageMode('app')}
          onExploreDemo={() => {
            setPageMode('app');
            setCurrentView('dashboard');
          }}
        />
      ) : (
        <AppLayout
          currentView={currentView}
          onNavigate={(view) => {
            setCoachPrompt(undefined);
            setCurrentView(view);
          }}
          user={user}
          activePlayer={activePlayer}
          matches={matches}
          onOpenAuth={() => setIsAuthOpen(true)}
          onLogout={() => {
            setUser(null);
            setPageMode('landing');
          }}
          onOpenAddMatch={() => setIsAddMatchOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        >
          {currentView === 'dashboard' && (
            <OverviewView
              matches={matches}
              activePlayer={activePlayer}
              user={user}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onNavigateToBatting={() => setCurrentView('batting')}
              onNavigateToBowling={() => setCurrentView('bowling')}
              onNavigateToCoach={() => setCurrentView('coach')}
              onNavigateToPrediction={() => setCurrentView('analytics')}
            />
          )}

          {currentView === 'batting' && (
            <BattingAnalyticsView
              matches={matches}
              activePlayer={activePlayer}
            />
          )}

          {currentView === 'bowling' && (
            <BowlingAnalyticsView
              matches={matches}
              activePlayer={activePlayer}
            />
          )}

          {currentView === 'matches' && (
            <MatchesView
              matches={matches}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onOpenAddMatch={() => setIsAddMatchOpen(true)}
            />
          )}

          {currentView === 'analytics' && (
            <div className="space-y-10">
              <PerformanceIntelligenceView
                matches={matches}
                activePlayer={activePlayer}
                onAskCoach={handleAskCoach}
              />
              <PredictionView
                matches={matches}
                activePlayer={activePlayer}
                onAskCoach={handleAskCoach}
              />
            </div>
          )}

          {currentView === 'coach' && (
            <AICoachView
              matches={matches}
              activePlayer={activePlayer}
              initialPrompt={coachPrompt}
            />
          )}

          {currentView === 'compare' && (
            <PlayerComparisonView
              matches={matches}
              activePlayer={activePlayer}
              onAskCoach={handleAskCoach}
            />
          )}

          {currentView === 'training' && (
            <TrainingView
              onAskCoach={handleAskCoach}
            />
          )}

          {currentView === 'profile' && (
            <ProfileView
              player={activePlayer}
              matches={matches}
              onAskCoach={handleAskCoach}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView
              matches={matches}
              onResetMatches={setMatches}
            />
          )}
        </AppLayout>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setPageMode('app');
        }}
      />

      {/* Add Match Modal */}
      <AddMatchModal
        isOpen={isAddMatchOpen}
        onClose={() => setIsAddMatchOpen(false)}
        onAddMatch={handleAddMatch}
        onBulkAddMatches={handleBulkAddMatches}
      />

      {/* Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onAskCoachAboutMatch={(m) => handleAskCoach(`Coach, analyze my innings of ${m.runs} off ${m.balls} against ${m.opponent} (dismissed: ${m.dismissal}).`)}
      />
    </ToastProvider>
  );
}
