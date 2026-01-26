import { authService, AuthApiError } from '@/services/AuthService.class';
import type {
  DropRequest,
  DropResponse,
  MultipliersResponse,
  HistoryResponse,
  RecentResponse,
} from '@/types/plinko';

class PlinkoService {
  private static instance: PlinkoService;
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private constructor() {}

  public static getInstance(): PlinkoService {
    if (!PlinkoService.instance) {
      PlinkoService.instance = new PlinkoService();
    }
    return PlinkoService.instance;
  }

  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    skipRefresh = false
  ): Promise<T> {
    const accessToken = authService.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
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
        return this.fetchApi<T>(endpoint, newOptions, true);
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

  public async drop(data: DropRequest): Promise<DropResponse> {
    return this.fetchApi<DropResponse>('/plinko/drop', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getMultipliers(
    risk: string,
    lines: number
  ): Promise<MultipliersResponse> {
    return this.fetchApi<MultipliersResponse>(
      `/plinko/multipliers?risk=${risk}&lines=${lines}`,
      {
        method: 'GET',
      }
    );
  }

  public async getHistory(
    limit: number = 10,
    offset: number = 0
  ): Promise<HistoryResponse> {
    return this.fetchApi<HistoryResponse>(
      `/plinko/history?limit=${limit}&offset=${offset}`,
      {
        method: 'GET',
      }
    );
  }

  public async getRecent(): Promise<RecentResponse> {
    return this.fetchApi<RecentResponse>('/plinko/recent', {
      method: 'GET',
    });
  }
}

export const plinkoService = PlinkoService.getInstance();
