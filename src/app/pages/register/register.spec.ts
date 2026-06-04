import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { of, throwError } from 'rxjs';
import { vi } from 'vitest';

import { Register } from './register';
import { AuthService } from '../../core/service/auth.service';

describe('Register Component', () => {
  let component: Register;
  let fixture: ComponentFixture<Register>;
  let authServiceMock: { register: ReturnType<typeof vi.fn> };
  let routerMock: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authServiceMock = { register: vi.fn() };
    routerMock = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [Register, ReactiveFormsModule, RouterModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Register);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // Test 1 - Formulaire initialisé
  it('should initialize the form with empty fields', () => {
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
  });

  // Test 2 - Formulaire invalide
  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(authServiceMock.register).not.toHaveBeenCalled();
  });

  // Test 3 - Email déjà existant
  it('should handle error if email already exists', () => {
    authServiceMock.register.mockReturnValue(throwError(() => ({ status: 409 })));
    component.registerForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    expect(authServiceMock.register).toHaveBeenCalled();
  });

  // Test 4 - Création réussie
  it('should redirect to /login on successful registration', () => {
    authServiceMock.register.mockReturnValue(of({}));
    component.registerForm.setValue({ email: 'test@test.com', password: 'password123' });
    component.onSubmit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });
});