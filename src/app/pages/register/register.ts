import { Component, OnInit, DestroyRef, inject } from "@angular/core";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { RegisterRequest } from "../../core/models/RegisterRequest";
import { AuthService } from "../../core/service/auth.service";

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: "app-register",
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./register.html",
  styleUrl: "./register.scss",
})
export class Register implements OnInit{

  private userService = inject(AuthService);
  private formBuilder = inject(FormBuilder);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);
  registerForm: FormGroup = new FormGroup({});
  submitted: boolean = false;

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        email: ['', Validators.required],
        password: ['', Validators.required]
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
