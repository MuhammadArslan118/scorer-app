export const APP_CONFIG = {
  appName: 'CricketScorer',
  version: '1.0.0',
  maxPlayersPerTeam: 15,
  minPlayersPerTeam: 11,
  oversPerBowler: {
    T10: 2,
    T20: 4,
    ODI: 10,
    Test: 999,
  },
  matchFormats: ['T10', 'T20', 'ODI', 'Test'] as const,
  ballsPerOver: 6,
};

export const FIREBASE_CONFIG = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_STORAGE_BUCKET',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId: 'YOUR_APP_ID',
};

export const STORAGE_KEYS = {
  authUser: '@cricket_scorer_auth',
  theme: '@cricket_scorer_theme',
  matches: '@cricket_scorer_matches',
  teams: '@cricket_scorer_teams',
};
