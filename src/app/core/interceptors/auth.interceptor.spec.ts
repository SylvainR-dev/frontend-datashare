import { TestBed } from '@angular/core/testing';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { vi } from 'vitest';

describe('authInterceptor', () => {

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1 — token présent → header Authorization ajouté
  it('should add Authorization header when token exists', () => {
    localStorage.setItem('token', 'fake-jwt-token');

    const req = new HttpRequest('GET', '/files');
    const next: HttpHandlerFn = vi.fn((clonedReq: any) => {
      expect(clonedReq.headers.get('Authorization')).toBe('Bearer fake-jwt-token');
      return {} as any;
    });

    interceptor(req, next);
    expect(next).toHaveBeenCalled();
  });

  // Test 2 — pas de token → requête envoyée sans modification
  it('should not add Authorization header when no token', () => {
    localStorage.removeItem('token');

    const req = new HttpRequest('GET', '/files');
    const next: HttpHandlerFn = vi.fn((originalReq: any) => {
      expect(originalReq.headers.get('Authorization')).toBeNull();
      return {} as any;
    });

    interceptor(req, next);
    expect(next).toHaveBeenCalled();
  });

});