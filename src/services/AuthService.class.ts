import {
  type RegisterRequest,
  type RegisterResponse,
  type LoginRequest,
  type LoginResponse,
  type TokenStorage,
  type CurrentUserResponse,
  type LeaderboardResponse,
  type LeaderboardPeriod,
} from '@/types/auth';
import { cookieUtils } from '@/utils/cookies';

export class AuthApiError extends Error {
  statusCode: number;
  status: number | undefined;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthApiError';
  }
}

class AuthService {
  static #instance: AuthService;
  readonly #API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  readonly #ACCESS_TOKEN_KEY = 'accessToken';
  readonly #REFRESH_TOKEN_KEY = 'refreshToken';

  private constructor() {
    // Migrate tokens from localStorage to cookies if they exist
    this.#migrateFromLocalStorage();
  }

  #migrateFromLocalStorage(): void {
    if (typeof window === 'undefined') return;

    // Check if tokens exist in localStorage
    const oldAccessToken = localStorage.getItem(this.#ACCESS_TOKEN_KEY);
    const oldRefreshToken = localStorage.getItem(this.#REFRESH_TOKEN_KEY);

    if (oldAccessToken && oldRefreshToken) {
      // Move to cookies
      this.saveTokens({
        accessToken: oldAccessToken,
        refreshToken: oldRefreshToken,
      });

      // Clean up localStorage
      localStorage.removeItem(this.#ACCESS_TOKEN_KEY);
      localStorage.removeItem(this.#REFRESH_TOKEN_KEY);

      // Tokens migrated from localStorage to cookies
    }
  }

  public static getInstance(): AuthService {
    if (!AuthService.#instance) {
      AuthService.#instance = new AuthService();
    }
    return AuthService.#instance;
  }

  public saveTokens(tokens: TokenStorage): void {
    if (typeof window === 'undefined') return;

    // Store tokens in cookies with 7 days expiration
    cookieUtils.set(this.#ACCESS_TOKEN_KEY, tokens.accessToken, {
      days: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    cookieUtils.set(this.#REFRESH_TOKEN_KEY, tokens.refreshToken, {
      days: 7,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    return cookieUtils.get(this.#ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    return cookieUtils.get(this.#REFRESH_TOKEN_KEY);
  }

  public getTokens(): TokenStorage | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  public removeTokens(): void {
    if (typeof window === 'undefined') return;

    cookieUtils.remove(this.#ACCESS_TOKEN_KEY);
    cookieUtils.remove(this.#REFRESH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // API Methods
  async #fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    skipRefresh = false
  ): Promise<T> {
    try {
      const response = await fetch(`${this.#API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      // Get response text first to handle empty responses
      const text = await response.text();

      // Try to parse as JSON, handle empty responses
      let data: T | null = null;
      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          // Response is not valid JSON
          throw new AuthApiError(
            `Invalid response from server: ${text.substring(0, 100)}`,
            response.status
          );
        }
      }

      // Handle 401 - try to refresh token and retry
      if (response.status === 401 && !skipRefresh) {
        const refreshed = await this.refreshTokens();
        if (refreshed) {
          // Retry the request with new token
          const newAccessToken = this.getAccessToken();
          const newOptions = {
            ...options,
            headers: {
              ...options?.headers,
              Authorization: `Bearer ${newAccessToken}`,
            },
          };
          return this.#fetchApi<T>(endpoint, newOptions, true);
        }
      }

      if (!response.ok) {
        const errorMessage =
          (data as { message?: string })?.message ||
          `Request failed with status ${response.status}`;
        throw new AuthApiError(errorMessage, response.status);
      }

      if (data === null) {
        throw new AuthApiError('Empty response from server', response.status);
      }

      return data;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AuthApiError(error.message, 500);
      }

      throw new AuthApiError('An unknown error occurred', 500);
    }
  }

  public async refreshTokens(): Promise<boolean> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return false;
    }

    try {
      const response = await fetch(`${this.#API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        this.removeTokens();
        return false;
      }

      const data = await response.json();
      // Save new tokens to cookies
      this.saveTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
      return true;
    } catch {
      this.removeTokens();
      return false;
    }
  }

  public async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.#fetchApi<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async login(data: LoginRequest): Promise<LoginResponse> {
    return this.#fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async logout(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    await this.#fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public async getCurrentUser(): Promise<CurrentUserResponse> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    return this.#fetchApi<CurrentUserResponse>('/users/current', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  public async getLeaderboard(
    period: LeaderboardPeriod = 'all'
  ): Promise<LeaderboardResponse> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    return this.#fetchApi<LeaderboardResponse>(
      `/leaderboard?period=${period}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  }

  public async getAllUsers(): Promise<
    Array<{ username: string; gamesPlayed: number; balance: number }>
  > {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    return this.#fetchApi<
      Array<{ username: string; gamesPlayed: number; balance: number }>
    >('/users', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export const authService = AuthService.getInstance();
