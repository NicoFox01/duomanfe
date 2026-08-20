import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../models/auth';

const TOKEN_KEY = 'duoman-auth-token';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = `${environment.apiUrl}/auth`;

  private readonly tokenSignal = signal<string | null>(this.loadToken());
  readonly isAuthenticated = computed(() => this.tokenSignal() !== null);

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.api}/login`, { email, password }).pipe(
      tap((res) => {
        this.tokenSignal.set(res.access_token);
        localStorage.setItem(TOKEN_KEY, res.access_token);
      }),
    );
  }

  logout(): void {
    this.tokenSignal.set(null);
    localStorage.removeItem(TOKEN_KEY);
  }

  getToken(): string | null {
    return this.tokenSignal();
  }

  private loadToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }
}