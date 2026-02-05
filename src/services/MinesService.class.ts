import { authService, AuthApiError } from '@/services/AuthService.class';
import type {
  MinesStartGameRequest,
  MinesStartGameResponse,
  MinesRevealCellRequest,
  MinesRevealCellResponse,
  MinesCashoutRequest,
  MinesCashoutResponse,
  MinesActiveGameResponse,
} from '@/types/mines';

class MinesService {
  private static instance: MinesService;
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private constructor() {}

  public static getInstance(): MinesService {
    if (!MinesService.instance) {
      MinesService.instance = new MinesService();
    }
    return MinesService.instance;
  }

  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    skipRefresh = false,
    token?: string
  ): Promise<T> {
    const accessToken = token || authService.getAccessToken();
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
    if (response.status === 401 && !skipRefresh && !token) {
      const refreshed = await authService.refreshTokens();
      if (refreshed) {
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

  public async startGame(
    data: MinesStartGameRequest
  ): Promise<MinesStartGameResponse> {
    return this.fetchApi<MinesStartGameResponse>('/mines/start', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async revealCell(
    data: MinesRevealCellRequest
  ): Promise<MinesRevealCellResponse> {
    return this.fetchApi<MinesRevealCellResponse>('/mines/reveal', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async cashout(
    data: MinesCashoutRequest
  ): Promise<MinesCashoutResponse> {
    return this.fetchApi<MinesCashoutResponse>('/mines/cashout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getActiveGame(token?: string): Promise<MinesActiveGameResponse> {
    return this.fetchApi<MinesActiveGameResponse>(
      '/mines/active',
      {
        method: 'GET',
      },
      false,
      token
    );
  }
}

export const minesService = MinesService.getInstance();
