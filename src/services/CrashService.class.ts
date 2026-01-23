import { authService, AuthApiError } from '@/services/AuthService.class';
import type {
  CrashCurrentGame,
  PlaceBetRequest,
  PlaceBetResponse,
  CashoutRequest,
  CashoutResponse,
} from '@/types/crash';

class CrashService {
  private static instance: CrashService;
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private constructor() {}

  public static getInstance(): CrashService {
    if (!CrashService.instance) {
      CrashService.instance = new CrashService();
    }
    return CrashService.instance;
  }

  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
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

  public async getCurrentGame(): Promise<CrashCurrentGame> {
    return this.fetchApi<CrashCurrentGame>('/crash/current', {
      method: 'GET',
    });
  }

  public async placeBet(data: PlaceBetRequest): Promise<PlaceBetResponse> {
    return this.fetchApi<PlaceBetResponse>('/crash/bet', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async cashout(data: CashoutRequest): Promise<CashoutResponse> {
    return this.fetchApi<CashoutResponse>('/crash/cashout', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const crashService = CrashService.getInstance();
