import { BaseService } from './BaseService.class';
import type {
  CrashCurrentGame,
  PlaceBetRequest,
  PlaceBetResponse,
  CashoutRequest,
  CashoutResponse,
} from '@/types/crash';
import type { CrashHistoryResponse } from '@/hooks/useHistoryTable.types';

class CrashService extends BaseService {
  static #instance: CrashService;

  private constructor() {
    super();
  }

  public static getInstance(): CrashService {
    if (!CrashService.#instance) {
      CrashService.#instance = new CrashService();
    }
    return CrashService.#instance;
  }

  public async getCurrentGame(token?: string): Promise<CrashCurrentGame> {
    return this.fetchWithOptionalToken<CrashCurrentGame>(
      '/crash/current',
      { method: 'GET' },
      token
    );
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

  public async getAllGamesHistory(
    token?: string,
    options?: { limit?: number }
  ): Promise<CrashHistoryResponse> {
    const limit = options?.limit || 10;
    const endpoint = `/crash/history?limit=${limit}&offset=0`;

    return this.fetchWithOptionalToken<CrashHistoryResponse>(
      endpoint,
      { method: 'GET' },
      token
    );
  }
}

export const crashService = CrashService.getInstance();
