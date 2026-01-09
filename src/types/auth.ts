export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  userId: string;
  userName: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface TokenStorage {
  accessToken: string;
  refreshToken: string;
}
