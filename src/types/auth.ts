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

export interface RegisterRequest extends LoginRequest {
  username: string;
}

export interface RegisterResponse {
  username: string;
  email: string;
}

export interface TokenStorage {
  accessToken: string;
  refreshToken: string;
}

export interface CurrentUserResponse {
  username: string;
  email: string;
  balance: number;
  totalWagered: number;
  gamesPlayed: number;
  totalWon: number;
}
