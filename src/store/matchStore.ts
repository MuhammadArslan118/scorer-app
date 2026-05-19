import { create } from 'zustand';
import { Match, Ball, Innings, Player } from '../types';
import { BALLS_PER_OVER, getBallRuns, isLegalDelivery } from '../utils/cricket';
import { DUMMY_MATCHES, DUMMY_TEAMS } from '../data/dummy';
import { localStorageService } from '../services/localStorage';

interface MatchState {
  matches: Match[];
  currentMatch: Match | null;
  strikerId: string | null;
  nonStrikerId: string | null;
  currentBowlerId: string | null;
  isLoading: boolean;

  setCurrentMatch: (match: Match) => void;
  loadMatches: () => Promise<void>;
  createMatch: (match: Partial<Match>) => string;
  updateMatch: (id: string, data: Partial<Match>) => void;
  addBall: (ball: Omit<Ball, 'id'>) => void;
  undoLastBall: () => Ball | null;
  setStriker: (strikerId: string, nonStrikerId: string) => void;
  setBowler: (bowlerId: string) => void;
  rotateStrike: () => void;
  getCurrentInnings: () => Innings | null;
  initializeMatchWithTeams: (team1Players: Player[], team2Players: Player[]) => void;
}

function generateId(): string {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: DUMMY_MATCHES,
  currentMatch: DUMMY_MATCHES[0] || null,
  strikerId: null,
  nonStrikerId: null,
  currentBowlerId: null,
  isLoading: false,

  setCurrentMatch: (match) => {
    const innings = match.innings?.[match.currentInnings];
    let strikerId = null;
    let nonStrikerId = null;
    let currentBowlerId = null;

    if (innings) {
      strikerId = innings.battingOrder[0] || null;
      nonStrikerId = innings.battingOrder[1] || null;
      currentBowlerId = innings.bowlingOrder[0] || null;
    }

    set({ currentMatch: match, strikerId, nonStrikerId, currentBowlerId });
  },

  loadMatches: async () => {
    set({ isLoading: true });
    const saved = await localStorageService.getMatches();
    if (saved.length > 0) {
      set({ matches: saved, isLoading: false });
    } else {
      set({ matches: DUMMY_MATCHES, isLoading: false });
    }
  },

  createMatch: (matchData) => {
    const id = generateId();
    const teams = matchData.teams || [];

    const innings: Innings[] = [
      {
        id: generateId(),
        teamId: teams[0]?.id || '',
        battingOrder: teams[0]?.players?.map((p) => p.id) || [],
        bowlingOrder: teams[1]?.players?.filter((p) => p.role === 'bowler' || p.role === 'all-rounder').map((p) => p.id) || [],
        overs: [],
        totalRuns: 0,
        totalWickets: 0,
        extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, total: 0 },
        isComplete: false,
      },
    ];

    const match: Match = {
      id,
      title: matchData.title || `${teams[0]?.name || 'Team A'} vs ${teams[1]?.name || 'Team B'}`,
      format: matchData.format || 'T20',
      overs: matchData.overs || 20,
      venue: matchData.venue || 'Unknown Venue',
      date: new Date(),
      teams,
      innings,
      currentInnings: 0,
      status: 'scheduled',
      createdBy: 'u1',
      isPublic: matchData.isPublic ?? true,
    };

    set((state) => {
      const newMatches = [...state.matches, match];
      localStorageService.saveMatches(newMatches);
      return { matches: newMatches, currentMatch: match };
    });

    return id;
  },

  updateMatch: (id, data) => {
    set((state) => {
      const newMatches = state.matches.map((m) =>
        m.id === id ? { ...m, ...data } : m
      );
      localStorageService.saveMatches(newMatches);
      return {
        matches: newMatches,
        currentMatch:
          state.currentMatch?.id === id
            ? { ...state.currentMatch, ...data }
            : state.currentMatch,
      };
    });
  },

  addBall: (ballData) => {
    const state = get();
    const match = state.currentMatch;
    if (!match) return;

    const inningIdx = match.currentInnings;
    const innings = { ...match.innings[inningIdx] };
    const overs = [...innings.overs];
    const lastOver = overs[overs.length - 1];
    const ballOverNumber = lastOver && lastOver.balls.length < BALLS_PER_OVER
      ? lastOver.overNumber
      : overs.length + 1;

    const ballNumber = lastOver && ballOverNumber === lastOver.overNumber
      ? lastOver.balls.length + 1
      : 1;

    const newBall: Ball = {
      ...ballData,
      id: generateId(),
      overNumber: ballOverNumber,
      ballNumber,
    };

    if (ballNumber === 1) {
      overs.push({
        overNumber: ballOverNumber,
        balls: [newBall],
        totalRuns: getBallRuns(newBall),
        isMaiden: false,
        bowlerId: ballData.bowlerId,
      });
    } else if (lastOver) {
      lastOver.balls = [...lastOver.balls, newBall];
      lastOver.totalRuns += getBallRuns(newBall);
      lastOver.isMaiden = getBallRuns(newBall) === 0 && lastOver.balls.length === BALLS_PER_OVER;
      overs[overs.length - 1] = lastOver;
    }

    const isLegal = isLegalDelivery(newBall);
    const legalBalls = overs.flatMap((o) => o.balls).filter(isLegalDelivery);
    const inningsComplete = legalBalls.length >= match.overs * BALLS_PER_OVER || innings.totalWickets >= 10;

    const newInnings: Innings = {
      ...innings,
      overs,
      totalRuns: overs.reduce((sum, o) => sum + o.totalRuns, 0),
      totalWickets: overs.flatMap((o) => o.balls).filter((b) => b.isWicket).length,
      extras: {
        wides: overs.flatMap((o) => o.balls).filter((b) => b.isWide).length,
        noBalls: overs.flatMap((o) => o.balls).filter((b) => b.isNoBall).length,
        byes: overs.flatMap((o) => o.balls).filter((b) => b.isBye).length,
        legByes: overs.flatMap((o) => o.balls).filter((b) => b.isLegBye).length,
        total: overs.flatMap((o) => o.balls).reduce((sum, b) => sum + (b.isWide ? 1 : 0) + (b.isNoBall ? 1 : 0), 0),
      },
      isComplete: inningsComplete,
    };

    const newInningsList = [...match.innings];
    newInningsList[inningIdx] = newInnings;

    const newStatus: Match['status'] = inningsComplete 
      ? (inningIdx === 0 && match.innings.length > 1 ? 'live' : 'completed')
      : 'live';

    const updatedMatch: Match = {
      ...match,
      innings: newInningsList,
      status: newStatus,
      currentInnings: inningsComplete && inningIdx === 0 && match.innings.length > 1 ? 1 : match.currentInnings,
    };

    set((state) => {
      const newMatches = state.matches.map((m) =>
        m.id === updatedMatch.id ? updatedMatch : m
      );
      localStorageService.saveMatches(newMatches);
      return { currentMatch: updatedMatch, matches: newMatches };
    });
  },

  undoLastBall: () => {
    const state = get();
    const match = state.currentMatch;
    if (!match) return null;

    const inningIdx = match.currentInnings;
    const innings = { ...match.innings[inningIdx] };
    const overs = [...innings.overs];

    if (overs.length === 0) return null;

    const lastOver = { ...overs[overs.length - 1] };
    if (lastOver.balls.length === 0) return null;

    const removedBall = lastOver.balls[lastOver.balls.length - 1];
    lastOver.balls = lastOver.balls.slice(0, -1);

    if (lastOver.balls.length === 0) {
      overs.pop();
    } else {
      lastOver.totalRuns = lastOver.balls.reduce((sum, b) => sum + getBallRuns(b), 0);
      lastOver.isMaiden = false;
      overs[overs.length - 1] = lastOver;
    }

    const newInnings: Innings = {
      ...innings,
      overs,
      totalRuns: overs.reduce((sum, o) => sum + o.totalRuns, 0),
      totalWickets: overs.flatMap((o) => o.balls).filter((b) => b.isWicket).length,
      extras: {
        wides: overs.flatMap((o) => o.balls).filter((b) => b.isWide).length,
        noBalls: overs.flatMap((o) => o.balls).filter((b) => b.isNoBall).length,
        byes: overs.flatMap((o) => o.balls).filter((b) => b.isBye).length,
        legByes: overs.flatMap((o) => o.balls).filter((b) => b.isLegBye).length,
        total: overs.flatMap((o) => o.balls).reduce((sum, b) => sum + (b.isWide ? 1 : 0) + (b.isNoBall ? 1 : 0), 0),
      },
      isComplete: false,
    };

    const newInningsList = [...match.innings];
    newInningsList[inningIdx] = newInnings;

    const updatedMatch: Match = { ...match, innings: newInningsList, status: 'live' };

    set((state) => {
      const newMatches = state.matches.map((m) =>
        m.id === updatedMatch.id ? updatedMatch : m
      );
      localStorageService.saveMatches(newMatches);
      return { currentMatch: updatedMatch, matches: newMatches };
    });

    return removedBall;
  },

  setStriker: (strikerId, nonStrikerId) => set({ strikerId, nonStrikerId }),

  setBowler: (bowlerId) => set({ currentBowlerId: bowlerId }),

  rotateStrike: () => {
    set((state) => ({
      strikerId: state.nonStrikerId,
      nonStrikerId: state.strikerId,
    }));
  },

  getCurrentInnings: () => {
    const state = get();
    if (!state.currentMatch) return null;
    return state.currentMatch.innings[state.currentMatch.currentInnings] || null;
  },

  initializeMatchWithTeams: (team1Players, team2Players) => {
    set((state) => {
      const match = state.currentMatch;
      if (!match) return state;

      const teams = [
        { ...match.teams[0], players: team1Players },
        { ...match.teams[1], players: team2Players },
      ];

      return {
        currentMatch: { ...match, teams },
      };
    });
  },
}));
