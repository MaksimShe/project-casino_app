import { authService } from './AuthService.class';
import type { BonusStatusResponse, BonusClaimResponse } from '@/types/bonus';

class BonusService {
  static #instance: BonusService;
  readonly #API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private constructor() {}

  public static getInstance(): BonusService {
    if (!BonusService.#instance) {
      BonusService.#instance = new BonusService();
    }
    return BonusService.#instance;
  }

  async #fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    providedToken?: string
  ): Promise<T> {
    const accessToken = providedToken || authService.getAccessToken();
    if (!accessToken) {
      throw new Error('No access token found');
    }

    const response = await fetch(`${this.#API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Request failed with status ${response.status}`
      );
    }

    return response.json();
  }

  public async getBonusStatus(token?: string): Promise<BonusStatusResponse> {
    return this.#fetchApi<BonusStatusResponse>(
      '/bonus/status',
      undefined,
      token
    );
  }

  public async claimBonus(token?: string): Promise<BonusClaimResponse> {
    return this.#fetchApi<BonusClaimResponse>(
      '/bonus/claim',
      {
        method: 'POST',
      },
      token
    );
  }
}

export const bonusService = BonusService.getInstance();
