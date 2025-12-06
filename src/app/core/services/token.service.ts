import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly ACCESS_KEY = 'app_access_token';
  private readonly REFRESH_KEY = 'app_refresh_token';

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_KEY);
  }

  saveTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_KEY, access);
    localStorage.setItem(this.REFRESH_KEY, refresh);
  }

  clear(): void {
    localStorage.removeItem(this.ACCESS_KEY);
    localStorage.removeItem(this.REFRESH_KEY);
  }

  getUserId(): number {
    const token = this.getAccessToken();
    if (!token) {
      return 0;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id || 0;
    } catch (error) {
      console.error('Error decoding token:', error);
      return 0;
    }
  }
}
