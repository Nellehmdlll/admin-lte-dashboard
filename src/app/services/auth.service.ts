import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.clear();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getTokenType(): string {
    return localStorage.getItem('token_type') || 'Bearer';
  }

  getUserRole(): string | null {
    return localStorage.getItem('role');
  }

  hasRole(role: string): boolean {
    return this.getUserRole() === role;
  }

   register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/inscription`, data);
  }
}

