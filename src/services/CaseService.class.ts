import { authService, AuthApiError } from '@/services/AuthService.class';
import type {
  CasesResponse,
  CaseDetailsResponse,
  OpenCaseResponse,
} from '@/types/case';

class CaseService {
  private static instance: CaseService;
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  private constructor() {}

  public static getInstance(): CaseService {
    if (!CaseService.instance) {
      CaseService.instance = new CaseService();
    }
    return CaseService.instance;
  }

  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    skipRefresh = false,
    providedToken?: string
  ): Promise<T> {
    // Use provided token (for server-side) or get from client-side
    const accessToken = providedToken || authService.getAccessToken();
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
