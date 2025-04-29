import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Connexion à votre compte</h2>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input 
              type="email" 
              id="email" 
              formControlName="email" 
              class="form-control" 
              placeholder="votre.email@exemple.com" 
            />
            @if (emailControl.touched && emailControl.errors) {
              <div class="form-error">
                @if (emailControl.errors['required']) {
                  L'email est requis
                } @else if (emailControl.errors['email']) {
                  Veuillez entrer un email valide
                }
              </div>
            }
          </div>
          
          <div class="form-group">
            <label for="password" class="form-label">Mot de passe</label>
            <input 
              type="password" 
              id="password" 
              formControlName="password" 
              class="form-control" 
              placeholder="Entrez votre mot de passe" 
            />
            @if (passwordControl.touched && passwordControl.errors) {
              <div class="form-error">
                @if (passwordControl.errors['required']) {
                  Le mot de passe est requis
                } @else if (passwordControl.errors['minlength']) {
                  Le mot de passe doit contenir au moins 6 caractères
                }
              </div>
            }
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block" 
              [disabled]="loginForm.invalid || isLoading"
            >
              @if (isLoading) {
                Connexion en cours...
              } @else {
                Se connecter
              }
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Vous n'avez pas de compte ? <a routerLink="/auth/register" class="text-primary">Inscrivez-vous ici</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      padding: var(--space-4);
    }
    
    .auth-card {
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      padding: var(--space-5);
      width: 100%;
      max-width: 450px;
    }
    
    .auth-title {
      text-align: center;
      margin-bottom: var(--space-4);
    }
    
    .auth-form {
      margin-bottom: var(--space-4);
    }
    
    .form-error {
      color: var(--error-500);
      font-size: 0.875rem;
      margin-top: var(--space-1);
    }
    
    .form-actions {
      margin-top: var(--space-4);
    }
    
    .btn-block {
      width: 100%;
    }
    
    .auth-footer {
      text-align: center;
      border-top: 1px solid var(--neutral-200);
      padding-top: var(--space-3);
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  get emailControl() {
    return this.loginForm.get('email')!;
  }

  get passwordControl() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        this.toastService.show({
          message: `Bienvenue, ${response.user.firstName} !`,
          type: 'success'
        });
        
        if (response.user.role === 'teacher') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        
        this.toastService.show({
          message: error.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.',
          type: 'error'
        });
      }
    });
  }
}
