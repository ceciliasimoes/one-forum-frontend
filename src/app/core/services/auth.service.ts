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

  private readonly isLoggedSubject = new BehaviorSubject<boolean>(!!this.tokenService.getAccessToken());
  readonly isLogged$ = this.isLoggedSubject.asObservable();

  readonly currentUser = signal<User | null>(null);

  constructor() {
    this.loadUserOnStart();
  }

  private loadUserOnStart(): void {
    const id = this.tokenService.getUserId();
    if (!id) return;

    this.fetchUser(id).subscribe(user => this.currentUser.set(user));
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
      tap(res => {
        this.tokenService.saveTokens(res.accessToken, res.refreshToken);
        this.isLoggedSubject.next(true);

        const id = this.tokenService.getUserId();
        if (id) {
          this.fetchUser(id).subscribe(user => this.currentUser.set(user));
        }
      })
    );
  }

  logout(): void {
    this.tokenService.clear();
    this.isLoggedSubject.next(false);
    this.currentUser.set(null);
    this.router.navigateByUrl('/login');
  }
}
