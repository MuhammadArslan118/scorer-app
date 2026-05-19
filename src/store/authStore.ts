import { create } from 'zustand';
import { User } from '../types';
import { localStorageService } from '../services/localStorage';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  loadPersistedUser: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user }),

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const dummyUser: User = {
        id: 'u1',
        email,
        name: email.split('@')[0],
        createdAt: new Date(),
      };
      await localStorageService.saveUser(dummyUser);
      set({ user: dummyUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signup: async (email: string, password: string, name: string) => {
    set({ isLoading: true });
    try {
      const newUser: User = {
        id: 'u' + Date.now(),
        email,
        name,
        createdAt: new Date(),
      };
      await localStorageService.saveUser(newUser);
      set({ user: newUser, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    await localStorageService.clearUser();
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  loadPersistedUser: async () => {
    try {
      const savedUser = await localStorageService.getUser();
      set({ user: savedUser, isAuthenticated: !!savedUser, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  updateProfile: (data) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...data };
      localStorageService.saveUser(updatedUser);
      set({ user: updatedUser });
    }
  },
}));
