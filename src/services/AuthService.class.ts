import {
  type RegisterRequest,
  type RegisterResponse,
  type LoginRequest,
  type LoginResponse,
  type TokenStorage,
} from '@/types/auth';

export class AuthApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthApiError';
  }
}

class AuthService {
  private static instance: AuthService;
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  private readonly ACCESS_TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public saveTokens(tokens: TokenStorage): void {
    if (typeof window === 'undefined') return;

    localStorage.setItem(this.ACCESS_TOKEN_KEY, tokens.accessToken);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, tokens.refreshToken);
  }

  public getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  public getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;

    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public getTokens(): TokenStorage | null {
    const accessToken = this.getAccessToken();
    const refreshToken = this.getRefreshToken();

    if (!accessToken || !refreshToken) return null;

    return { accessToken, refreshToken };
  }

  public removeTokens(): void {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  public isAuthenticated(): boolean {
    return !!this.getAccessToken() && !!this.getRefreshToken();
  }

  // API Methods
  private async fetchApi<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new AuthApiError(
          data.message || 'An error occurred',
          response.status
        );
      }

      return data;
    } catch (error) {
      if (error instanceof AuthApiError) {
        throw error;
      }

      if (error instanceof Error) {
        throw new AuthApiError(error.message, 500);
      }

      throw new AuthApiError('An unknown error occurred', 500);
    }
  }

  public async register(data: RegisterRequest): Promise<RegisterResponse> {
    return this.fetchApi<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async login(data: LoginRequest): Promise<LoginResponse> {
    return this.fetchApi<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  public async logout(): Promise<void> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new AuthApiError('No access token found', 401);
    }

    await this.fetchApi<{ message: string }>('/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }
}

export const authService = AuthService.getInstance();
