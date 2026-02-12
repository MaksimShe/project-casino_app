import { BaseService } from './BaseService.class';
import type {
  DropRequest,
  DropResponse,
  MultipliersResponse,
  HistoryResponse,
  RecentResponse,
} from '@/types/plinko';

class PlinkoService extends BaseService {
  static #instance: PlinkoService;

  private constructor() {
    super();
  }

  public static getInstance(): PlinkoService {
    if (!PlinkoService.#instance) {
      PlinkoService.#instance = new PlinkoService();
    }
    return PlinkoService.#instance;
  }

  public async drop(data: DropRequest): Promise<DropResponse> {
    return this.fetchApi<DropResponse>('/plinko/drop', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async getMultipliers(
    risk: string,
    lines: number,
    token?: string
  ): Promise<MultipliersResponse> {
    const endpoint = `/plinko/multipliers?risk=${risk}&lines=${lines}`;

    return this.fetchWithOptionalToken<MultipliersResponse>(
      endpoint,
      { method: 'GET' },
      token
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
