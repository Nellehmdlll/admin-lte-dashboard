// services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = 'http://localhost:8000/api'; // adapte si besoin

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`);
  }

  assignRole(userId: number, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign-role`, { user_id: userId, role });
  }
}
