import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  private tokenKey = 'authToken';
  private tokenExpirationKey = 'tokenExpiration';

  isAuthenticated(): boolean {
    const token = this.getToken();
    const expiration = this.getTokenExpiration();
    if (token && expiration) {
      return new Date().getTime() < new Date(expiration).getTime();
    }
    return false;
  }

  setToken(token: string, expiration: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.tokenExpirationKey, expiration);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getTokenExpiration(): string | null {
    return localStorage.getItem(this.tokenExpirationKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.tokenExpirationKey);
  }
}
