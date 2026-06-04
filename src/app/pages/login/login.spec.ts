import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Login } from './login';
import { AuthService } from '../../core/service/auth.service';

describe('Login Component', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;
  let authServiceMock: { login: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = { login: vi.fn() };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Login, ReactiveFormsModule, RouterModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1 - Formulaire initialisé
  it('should initialize the form with empty fields', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  // Test 2 - Formulaire invalide
  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(authServiceMock.login).not.toHaveBeenCalled();
  });

  // Test 3 - Identifiants incorrects
  it('should handle error if credentials are invalid', () => {
    authServiceMock.login.mockReturnValue(throwError(() => ({ status: 401 })));
    component.loginForm.setValue({ email: 'test@test.com', password: 'wrongpassword' });
    component.onSubmit();
    expect(authServiceMock.login).toHaveBeenCalled();
  });

  // Test 4 - Connexion réussie
  it('should redirect to /upload on successful login', () => {
    authServiceMock.login.mockReturnValue(of({}));
    component.loginForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/upload']);
  });
});