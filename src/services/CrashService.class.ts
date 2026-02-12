import { authService, AuthApiError } from '@/services/AuthService.class';
import type {
  CrashCurrentGame,
  PlaceBetRequest,
  PlaceBetResponse,
  CashoutRequest,
  CashoutResponse,
} from '@/types/crash';
import type { CrashHistoryResponse } from '@/hooks/useHistoryTable.types';

class CrashService {
  static #instance: CrashService;
  readonly #API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private constructor() {}

  public static getInstance(): CrashService {
    if (!CrashService.#instance) {
      CrashService.#instance = new CrashService();
    }
    return CrashService.#instance;
  }

  async #fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    skipRefresh = false
  ): Promise<T> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    const response = await fetch(`${this.#API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options?.headers,
      },
      ...options,
    });

    const text = await response.text();
    let data: T | null = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new AuthApiError(
          `Invalid response from server: ${text.substring(0, 100)}`,
          response.status
        );
      }
    }

    // Handle 401 - try to refresh token and retry
    if (response.status === 401 && !skipRefresh) {
      const refreshed = await authService.refreshTokens();
      if (refreshed) {
        // Retry the request with new token
        const newAccessToken = authService.getAccessToken();
        const newOptions = {
          ...options,
          headers: {
            ...options?.headers,
            'Content-Type': 'application/json',
            Authorization: `Bearer ${newAccessToken}`,
          },
        };
        return this.#fetchApi<T>(endpoint, newOptions, true);
      }
      // If refresh failed, throw the error so it can be handled upstream
      throw new AuthApiError('Session expired. Please login again.', 401);
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
  }

  public async getCurrentGame(token?: string): Promise<CrashCurrentGame> {
    const endpoint = '/crash/current';

    // Server-side call with explicit token
    if (token) {
      const response = await fetch(`${this.#API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      let data: CrashCurrentGame | null = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new AuthApiError(
            `Invalid response from server: ${text.substring(0, 100)}`,
            response.status
          );
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
    }

    // Client-side call using cookies
    return this.#fetchApi<CrashCurrentGame>(endpoint, {
      method: 'GET',
    });
  }

  public async placeBet(data: PlaceBetRequest): Promise<PlaceBetResponse> {
    return this.#fetchApi<PlaceBetResponse>('/crash/bet', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async cashout(data: CashoutRequest): Promise<CashoutResponse> {
    return this.#fetchApi<CashoutResponse>('/crash/cashout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getAllGamesHistory(
    token?: string,
    options?: { limit?: number }
  ): Promise<CrashHistoryResponse> {
    const limit = options?.limit || 10;
    const endpoint = `/crash/history?limit=${limit}&offset=0`;

    // Server-side call with explicit token
    if (token) {
      const response = await fetch(`${this.#API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();
      let data: CrashHistoryResponse | null = null;

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new AuthApiError(
            `Invalid response from server: ${text.substring(0, 100)}`,
            response.status
          );
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
    }

    // Client-side call using cookies
    return this.#fetchApi<CrashHistoryResponse>(endpoint, {
      method: 'GET',
    });
  }
}

export const crashService = CrashService.getInstance();
