import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';
import { authGuard } from './auth.guard';
import { vi } from 'vitest';

describe('authGuard', () => {

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Router]
    });
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  // Test 1 — token présent → accès autorisé
  it('should allow access when token exists', () => {
    localStorage.setItem('token', 'fake-jwt-token');
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeTruthy();
  });

  // Test 2 — pas de token → redirection vers /login
  it('should redirect to login when no token', () => {
    const navigateSpy = vi.spyOn(router, 'navigate');
    localStorage.removeItem('token');
    const result = executeGuard({} as any, {} as any);
    expect(result).toBeFalsy();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
  });

});