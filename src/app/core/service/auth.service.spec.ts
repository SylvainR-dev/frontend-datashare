import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../models/RegisterRequest';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // Test 1 - Service créé correctement
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 2 - Appel HTTP correct
  it('should call POST /register with correct data', () => {
    const user: RegisterRequest = { email: 'test@test.com', password: 'password123' };

    service.register(user).subscribe();

    const req = httpMock.expectOne('http://localhost:8080/api/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(user);
    req.flush({});
  });

  // Test 3 - Création réussie
  it('should return success response', () => {
    const user: RegisterRequest = { email: 'test@test.com', password: 'password123' };
    const mockResponse = { message: 'User created' };

    service.register(user).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:8080/api/register');
    req.flush(mockResponse);
  });

  // Test 4 - Email déjà existant
  it('should handle 409 error if email already exists', () => {
    const user: RegisterRequest = { email: 'test@test.com', password: 'password123' };

    service.register(user).subscribe({
      error: (err) => {
        expect(err.status).toBe(409);
      }
    });

    const req = httpMock.expectOne('http://localhost:8080/api/register');
    req.flush('Email already exists', { status: 409, statusText: 'Conflict' });
  });
});