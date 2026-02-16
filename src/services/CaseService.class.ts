import { BaseService } from './BaseService.class';
import type {
  CasesResponse,
  CaseDetailsResponse,
  OpenCaseResponse,
} from '@/types/case';

class CaseService extends BaseService {
  static #instance: CaseService;

  private constructor() {
    super();
  }

  public static getInstance(): CaseService {
    if (!CaseService.#instance) {
      CaseService.#instance = new CaseService();
    }
    return CaseService.#instance;
  }

  public async getAllCases(token?: string): Promise<CasesResponse> {
    return this.fetchApi<CasesResponse>('/cases', undefined, false, token);
  }

  public async getCaseDetails(
    id: string,
    token?: string
  ): Promise<CaseDetailsResponse> {
    return this.fetchApi<CaseDetailsResponse>(
      `/cases/${id}`,
      undefined,
      false,
      token
    );
  }

  public async openCase(
    id: string,
    clientSeed?: string,
    token?: string
  ): Promise<OpenCaseResponse> {
    return this.fetchApi<OpenCaseResponse>(
      `/cases/${id}/open`,
      {
        method: 'POST',
        body: JSON.stringify({ clientSeed }),
      },
      false,
      token
    );
  }
}

export const caseService = CaseService.getInstance();
