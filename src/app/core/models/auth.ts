export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenData {
  token: string;
  expirationDate: string;
  createdAt: string;
}

export interface LoginResponse {
  accessToken: TokenData;
  refreshToken: TokenData;
}

export interface RegisterRequest {
  email: string;
  password: string;
  matchPassword: string;
  name: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}
