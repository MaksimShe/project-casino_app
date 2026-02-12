import { BaseService } from './BaseService.class';
import type {
  MinesStartGameRequest,
  MinesStartGameResponse,
  MinesRevealCellRequest,
  MinesRevealCellResponse,
  MinesCashoutRequest,
  MinesCashoutResponse,
  MinesActiveGameResponse,
} from '@/types/mines';

class MinesService extends BaseService {
  static #instance: MinesService;

  private constructor() {
    super();
  }

  public static getInstance(): MinesService {
    if (!MinesService.#instance) {
      MinesService.#instance = new MinesService();
    }
    return MinesService.#instance;
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
