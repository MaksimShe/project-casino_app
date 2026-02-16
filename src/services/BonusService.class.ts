import { BaseService } from './BaseService.class';
import type { BonusStatusResponse, BonusClaimResponse } from '@/types/bonus';

class BonusService extends BaseService {
  static #instance: BonusService;

  private constructor() {
    super();
  }

  public static getInstance(): BonusService {
    if (!BonusService.#instance) {
      BonusService.#instance = new BonusService();
    }
    return BonusService.#instance;
  }

  public async getBonusStatus(token?: string): Promise<BonusStatusResponse> {
    return this.fetchApi<BonusStatusResponse>(
      '/bonus/status',
      undefined,
      false,
      token
    );
  }

  public async claimBonus(token?: string): Promise<BonusClaimResponse> {
    return this.fetchApi<BonusClaimResponse>(
      '/bonus/claim',
      {
        method: 'POST',
      },
      false,
      token
    );
  }
}

export const bonusService = BonusService.getInstance();
