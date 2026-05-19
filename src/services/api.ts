import { Match, Team, Tournament, User } from '../types';

const API_BASE_URL = 'https://api.cricketscorer.com/v1';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: any
  ): Promise<ApiResponse<T>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || 'Request failed' };
      }

      return { success: true, data };
    } catch (error: any) {
      return { success: false, error: error.message || 'Network error' };
    }
  }

  get<T>(endpoint: string) {
    return this.request<T>('GET', endpoint);
  }

  post<T>(endpoint: string, body: any) {
    return this.request<T>('POST', endpoint, body);
  }

  put<T>(endpoint: string, body: any) {
    return this.request<T>('PUT', endpoint, body);
  }

  patch<T>(endpoint: string, body: any) {
    return this.request<T>('PATCH', endpoint, body);
  }

  delete<T>(endpoint: string) {
    return this.request<T>('DELETE', endpoint);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

export const api = {
  // Auth
  login: (email: string, password: string) =>
    apiClient.post<{ token: string; user: User }>('/auth/login', { email, password }),

  signup: (email: string, password: string, name: string) =>
    apiClient.post<{ token: string; user: User }>('/auth/signup', { email, password, name }),

  // Matches
  getMatches: () => apiClient.get<Match[]>('/matches'),
  getMatch: (id: string) => apiClient.get<Match>(`/matches/${id}`),
  createMatch: (match: Partial<Match>) => apiClient.post<Match>('/matches', match),
  updateMatch: (id: string, data: Partial<Match>) => apiClient.patch<Match>(`/matches/${id}`, data),

  // Teams
  getTeams: () => apiClient.get<Team[]>('/teams'),
  createTeam: (team: Partial<Team>) => apiClient.post<Team>('/teams', team),

  // Tournaments
  getTournaments: () => apiClient.get<Tournament[]>('/tournaments'),
  createTournament: (tournament: Partial<Tournament>) =>
    apiClient.post<Tournament>('/tournaments', tournament),
};
