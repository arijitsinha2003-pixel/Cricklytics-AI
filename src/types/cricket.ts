export type MatchFormat = 'T20' | 'ODI' | 'Test';
export type MatchResult = 'Won' | 'Lost' | 'Tied' | 'No Result';
export type DismissalType = 'Not Out' | 'Bowled' | 'Caught' | 'LBW' | 'Run Out' | 'Stumped' | 'Hit Wicket';
export type PlayerRole = 'Top-order Batter' | 'Middle-order Batter' | 'All-Rounder' | 'Wicketkeeper Batter' | 'Pace Bowler' | 'Spin Bowler';
export type BattingStyle = 'Right-hand bat' | 'Left-hand bat';
export type BowlingStyle = 'Right-arm medium fast' | 'Right-arm fast' | 'Right-arm off spin' | 'Right-arm leg spin' | 'Left-arm fast' | 'Left-arm orthodox';

export interface WagonWheelData {
  covers: number;      // Cover & Extra cover
  midwicket: number;   // Midwicket & Cow corner
  straight: number;    // Long on / Long off / Straight drive
  fineLeg: number;     // Fine leg & Square leg
  thirdMan: number;    // Third man & Point
  cutBehind: number;   // Gully & Behind point
}

export interface PhaseBreakdown {
  powerplay: { runs: number; balls: number; fours: number; sixes: number; wickets: number; overs: number; runsConceded: number };
  middle: { runs: number; balls: number; fours: number; sixes: number; wickets: number; overs: number; runsConceded: number };
  death: { runs: number; balls: number; fours: number; sixes: number; wickets: number; overs: number; runsConceded: number };
}

export interface MatchRecord {
  id: string;
  date: string;
  opponent: string;
  venue: string;
  format: MatchFormat;
  result: MatchResult;
  battingPosition: number;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  dismissal: DismissalType;
  dismissalBowlerType?: 'Pace' | 'Spin' | 'N/A';
  strikeRate: number;
  dotBalls: number;
  // Bowling
  oversBowled: number;
  maidens: number;
  runsConceded: number;
  wickets: number;
  economy: number;
  bowlingDotBalls: number;
  // Phase & Wagon Wheel
  phase: PhaseBreakdown;
  wagonWheel: WagonWheelData;
  // AI / Analysis
  performanceRating: number; // 0 to 10
  mvpPoints: number;
  notes?: string;
}

export interface RadarMetrics {
  batting: number;
  consistency: number;
  power: number;
  technique: number;
  fitness: number;
  clutch: number;
}

export interface PlayerProfile {
  id: string;
  name: string;
  avatar: string;
  role: PlayerRole;
  battingStyle: BattingStyle;
  bowlingStyle: BowlingStyle;
  team: string;
  age: number;
  jerseyNumber: number;
  bio: string;
  radar: RadarMetrics;
  primaryHand: 'Right' | 'Left';
  homeGround: string;
}

export interface AIInsight {
  id: string;
  category: 'strength' | 'weakness' | 'observation' | 'recommendation';
  title: string;
  description: string;
  metricImpact?: string;
  confidence: number; // e.g. 92%
  tags: string[];
  actionItem?: string;
}

export interface TrainingDrill {
  id: string;
  name: string;
  repsOrDuration: string;
  category: 'batting' | 'bowling' | 'fitness' | 'mental' | 'fielding';
  intensity: 'Low' | 'Medium' | 'High';
  completed: boolean;
  notes?: string;
}

export interface TrainingDay {
  id: string;
  day: string;
  title: string;
  focusArea: string;
  drills: TrainingDrill[];
}

export interface NextMatchPrediction {
  opponent: string;
  pitchType: 'Flat / Batting Friendly' | 'Green Seamer' | 'Dry Turning Track' | 'Slow & Low';
  venue: string;
  expectedRunsMin: number;
  expectedRunsMax: number;
  expectedStrikeRateMin: number;
  expectedStrikeRateMax: number;
  expectedWicketsMin: number;
  expectedWicketsMax: number;
  probabilityFiftyPlus: number;
  probabilityStrongForm: number;
  confidence: number;
  keyMatchupInsight: string;
  tacticalGameplan: string[];
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'coach';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  dataContext?: {
    statKey?: string;
    statValue?: string;
  };
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: 'Free' | 'Pro Athlete' | 'Coach Elite';
  isLoggedIn: boolean;
}
