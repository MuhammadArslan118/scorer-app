import { create } from 'zustand';
import { Team, Player } from '../types';
import { DUMMY_TEAMS } from '../data/dummy';
import { localStorageService } from '../services/localStorage';

interface TeamState {
  teams: Team[];
  isLoading: boolean;
  loadTeams: () => Promise<void>;
  createTeam: (team: Omit<Team, 'id'>) => string;
  addPlayer: (teamId: string, player: Omit<Player, 'id'>) => void;
  removePlayer: (teamId: string, playerId: string) => void;
  getTeamById: (id: string) => Team | undefined;
}

function generateId(): string {
  return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

export const useTeamStore = create<TeamState>((set, get) => ({
  teams: DUMMY_TEAMS,
  isLoading: false,

  loadTeams: async () => {
    set({ isLoading: true });
    const saved = await localStorageService.getTeams();
    if (saved.length > 0) {
      set({ teams: saved, isLoading: false });
    } else {
      set({ teams: DUMMY_TEAMS, isLoading: false });
    }
  },

  createTeam: (teamData) => {
    const id = generateId();
    const newTeam: Team = { id, ...teamData };
    set((state) => {
      const newTeams = [...state.teams, newTeam];
      localStorageService.saveTeams(newTeams);
      return { teams: newTeams };
    });
    return id;
  },

  addPlayer: (teamId, playerData) => {
    const id = generateId();
    const newPlayer: Player = { id, ...playerData };
    set((state) => {
      const newTeams = state.teams.map((team) =>
        team.id === teamId
          ? { ...team, players: [...team.players, newPlayer] }
          : team
      );
      localStorageService.saveTeams(newTeams);
      return { teams: newTeams };
    });
  },

  removePlayer: (teamId, playerId) => {
    set((state) => {
      const newTeams = state.teams.map((team) =>
        team.id === teamId
          ? {
              ...team,
              players: team.players.filter((p) => p.id !== playerId),
            }
          : team
      );
      localStorageService.saveTeams(newTeams);
      return { teams: newTeams };
    });
  },

  getTeamById: (id) => get().teams.find((t) => t.id === id),
}));
