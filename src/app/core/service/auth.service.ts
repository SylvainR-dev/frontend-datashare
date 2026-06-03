import { Injectable } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { LoginRequest } from '../models/LoginRequest';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) { }

  register(user: RegisterRequest): Observable<Object> {
    return this.httpClient.post(`${this.apiUrl}/api/register`, user);
  }

  login(user: LoginRequest): Observable<string> {
    return this.httpClient.post(`${this.apiUrl}/api/login`, user, { responseType: 'text' }).pipe(
      tap(token => localStorage.setItem('token', token))
    );
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

}