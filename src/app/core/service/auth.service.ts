import { Injectable } from '@angular/core';
import { RegisterRequest } from '../models/RegisterRequest';
import { LoginRequest } from '../models/LoginRequest';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClient: HttpClient) { }

  register(user: RegisterRequest): Observable<Object> {
    return this.httpClient.post('/register', user);
  }

  login (user: LoginRequest): Observable<Object> {
    return this.httpClient.post('/login', user);
  }

}