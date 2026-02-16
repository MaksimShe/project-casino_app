import { authService, AuthApiError } from './AuthService.class';

export abstract class BaseService {
  protected readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

  protected async fetchApi<T>(
    endpoint: string,
    options?: RequestInit,
    skipRefresh = false,
    providedToken?: string
  ): Promise<T> {
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

    if (response.status === 401 && !skipRefresh && !providedToken) {
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

  protected async fetchWithOptionalToken<T>(
    endpoint: string,
    options?: RequestInit,
    token?: string
  ): Promise<T> {
    return this.fetchApi<T>(endpoint, options, false, token);
  }
}
