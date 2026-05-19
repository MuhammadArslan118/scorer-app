export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface Player {
  id: string;
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  battingStyle?: 'right-handed' | 'left-handed';
  bowlingStyle?: 'fast' | 'medium' | 'spin';
  teamId: string;
}

export interface Team {
  id: string;
  name: string;
  shortName: string;
  players: Player[];
  logo?: string;
}

export interface Ball {
  id: string;
  overNumber: number;
  ballNumber: number;
  batsmanId: string;
  bowlerId: string;
  runs: number;
  isWide: boolean;
  isNoBall: boolean;
  isBye: boolean;
  isLegBye: boolean;
  isWicket: boolean;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'run-out' | 'stumped' | 'hit-wicket';
  fielderId?: string;
  commentary?: string;
}

export interface Over {
  overNumber: number;
  balls: Ball[];
  totalRuns: number;
  isMaiden: boolean;
  bowlerId: string;
}

export interface Innings {
  id: string;
  teamId: string;
  battingOrder: string[];
  bowlingOrder: string[];
  overs: Over[];
  totalRuns: number;
  totalWickets: number;
  extras: Extras;
  isComplete: boolean;
}

export interface Extras {
  wides: number;
  noBalls: number;
  byes: number;
  legByes: number;
  total: number;
}

export interface BattingStats {
  playerId: string;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalType?: string;
  dismissalBowlerId?: string;
  dismissalFielderId?: string;
}

export interface BowlingStats {
  playerId: string;
  overs: number;
  balls: number;
  maidens: number;
  runs: number;
  wickets: number;
  wides: number;
  noBalls: number;
}

export interface Partnership {
  batsman1Id: string;
  batsman2Id: string;
  runs: number;
  balls: number;
}

export interface FallOfWicket {
  wicketNumber: number;
  playerId: string;
  runsAtDismissal: number;
  overAtDismissal: number;
}

export interface Match {
  id: string;
  title: string;
  format: 'T10' | 'T20' | 'ODI' | 'Test';
  overs: number;
  venue: string;
  date: Date;
  teams: Team[];
  innings: Innings[];
  currentInnings: number;
  status: 'scheduled' | 'live' | 'completed' | 'abandoned';
  tossWinner?: string;
  tossDecision?: 'bat' | 'bowl';
  result?: string;
  manOfTheMatch?: string;
  createdBy: string;
  isPublic: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  format: 'knockout' | 'league' | 'group';
  teams: Team[];
  matches: string[];
  status: 'upcoming' | 'ongoing' | 'completed';
  startDate: Date;
  endDate?: Date;
  createdBy: string;
}

export interface Activity {
  id: string;
  type: 'match' | 'milestone' | 'achievement';
  title: string;
  description: string;
  matchId?: string;
  timestamp: Date;
  userId: string;
}
