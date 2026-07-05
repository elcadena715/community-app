import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServAuth } from '../../../services/serv-auth';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-auth',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login-auth.html',
  styleUrl: './login-auth.css',
})
export class LoginAuth {
  private fb = inject(FormBuilder);
  private auth = inject(ServAuth);
  private router = inject(Router);

  form: FormGroup;
  errorMessage = signal<string | null>(null);
  isLoading = signal<boolean>(false);

  constructor() {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]], 
      password: ['', Validators.required]
    });
  }

  isFieldInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    
    const { email, password } = this.form.value;

    this.auth.login(email, password).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']); 
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('Correo o contraseña incorrectos.');
      }
    });
  }

}
