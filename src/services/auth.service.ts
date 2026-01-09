import {
  type RegisterRequest,
  type RegisterResponse,
  type LoginRequest,
  type LoginResponse,
} from '@/types/auth';

const API_BASE_URL =
  'https://backend-internship-js-hw-03-blaze-casino.onrender.com/api';

export class AuthApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AuthApiError';
  }
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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

export async function register(
  data: RegisterRequest
): Promise<RegisterResponse> {
  return fetchApi<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return fetchApi<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Logout user (requires access token)
 */
export async function logout(accessToken: string): Promise<void> {
  await fetchApi<{ message: string }>('/auth/logout', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
