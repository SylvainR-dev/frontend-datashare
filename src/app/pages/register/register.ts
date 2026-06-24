// il gère le formulaire d'inscription, valide les données, appelle le backend via 
// AuthService, et redirige vers /login après inscription réussie

import { Component, OnInit, DestroyRef, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { RegisterRequest } from "../../core/models/RegisterRequest";
import { AuthService } from "../../core/service/auth.service";

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

@Component({
  selector: "app-register",
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
})
export class Register implements OnInit {

  private userService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;
  showPassword: boolean = false;
  showConfirm: boolean = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
    );
  }

  get form() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    const registerUser: RegisterRequest = {
      email: this.registerForm.get('email')?.value,
      password: this.registerForm.get('password')?.value
    };
    this.userService.register(registerUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error(err)
    });
  }

  onReset(): void {
    this.submitted = false;
    this.registerForm.reset();
  }
}


// Le flux
// Utilisateur remplit email + password
//         ↓
// onSubmit() → vérifie que le formulaire est valide
//         ↓
// Construit RegisterRequest (email + password)
//         ↓
// AuthService.register(registerRequest)
//         ↓
// AuthInterceptor (pas de token, requête sans modification)
//         ↓
// Backend POST /api/register → UserController → UserService → UserRepository
//         ↓
// Retourne UserResponseDTO (id + email + createdAt)
//         ↓
// router.navigate(['/login'])