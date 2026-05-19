import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';
import { Match, Team } from '../types';

export const localStorageService = {
  saveUser: async (user: any) => {
    await AsyncStorage.setItem(STORAGE_KEYS.authUser, JSON.stringify(user));
  },

  getUser: async () => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.authUser);
    return data ? JSON.parse(data) : null;
  },

  clearUser: async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.authUser);
  },

  saveTheme: async (theme: 'light' | 'dark') => {
    await AsyncStorage.setItem(STORAGE_KEYS.theme, theme);
  },

  getTheme: async (): Promise<'light' | 'dark'> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.theme);
    return (data as 'light' | 'dark') || 'light';
  },

  saveMatches: async (matches: Match[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.matches, JSON.stringify(matches));
  },

  getMatches: async (): Promise<Match[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.matches);
    return data ? JSON.parse(data) : [];
  },

  saveTeams: async (teams: Team[]) => {
    await AsyncStorage.setItem(STORAGE_KEYS.teams, JSON.stringify(teams));
  },

  getTeams: async (): Promise<Team[]> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.teams);
    return data ? JSON.parse(data) : [];
  },
};
