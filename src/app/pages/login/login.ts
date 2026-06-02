import { Component, OnInit, DestroyRef, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { LoginRequest } from "../../core/models/LoginRequest";
import { AuthService } from "../../core/service/auth.service";

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: "app-login",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./login.html",
  styleUrl: "./login.scss",
})
export class Login implements OnInit {

  private authService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  loginForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get form() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    const loginUser: LoginRequest = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };
    this.authService.login(loginUser)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: (err) => console.error(err)
      });
  }

  onReset(): void {
    this.submitted = false;
    this.loginForm.reset();
  }
}