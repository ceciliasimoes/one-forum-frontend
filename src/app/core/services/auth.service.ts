import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest, LoginResponse, RegisterRequest, RefreshTokenRequest } from '../models/auth';
import { TokenService } from './token.service';
import { inject } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface User {
  id: number;
  email: string;
  profileName: string;
  profilePhoto: string;
  topicCreatedCount: number;
  commentsCount: number;
  createdAt: string;
  updateAt: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly tokenService = inject(TokenService);

  private readonly baseUrl = environment.apiBaseUrl;

  private readonly isLoggedSubject = new BehaviorSubject<boolean>(
    !!this.tokenService.getAccessToken()
  );
  readonly isLogged$ = this.isLoggedSubject.asObservable();

  readonly currentUser = signal<User | null>(null);

  authCheckCompleted = signal(false);

  constructor() {
    this.loadUserOnStart();
  }

  private loadUserOnStart(): void {
    const id = this.tokenService.getUserId();
    if (!id) return;

    this.fetchUser(id).subscribe({
      next: (user) => {
        this.authCheckCompleted.set(true)
        return this.currentUser.set(user)
      },
      error: () => {
        this.logout();
      }
    });

  }

  updateUserData() {
    this.fetchUser(this.currentUser()!.id).subscribe(
      data => this.currentUser.set(data)
    )
  }

  fetchUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/${id}`);
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users/register`, data, { observe: 'response' });
  }

  uploadProfile(file: File): Observable<string> {
    const form = new FormData();
    form.append('file', file);
    return this.http.post(`${this.baseUrl}/upload`, form, { responseType: 'text' });
  }

  login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, data).pipe(
      tap((res) => {
        this.tokenService.saveTokens(res.accessToken.token, res.refreshToken.token);
        this.isLoggedSubject.next(true);

        const id = this.tokenService.getUserId();
        if (id) {
          this.fetchUser(id).subscribe((user) => this.currentUser.set(user));
        }
      })
    );
  }

  requestConfirmAccount(token: string): Observable<{ status: string; message: string }> {
    return this.http.post<{ status: string; message: string }>(
      `${this.baseUrl}/auth/confirm-account`,
      { token }
    );
  }

  requestResendConfirmationEmail(email: string): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/request-confirm-account`, { email });
  }

  logout(): void {
    this.tokenService.clear();
    this.isLoggedSubject.next(false);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }
}
