import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="auth-title">Créer votre compte</h2>
        
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-row">
            <div class="form-group">
              <label for="firstName" class="form-label">Prénom</label>
              <input 
                type="text" 
                id="firstName" 
                formControlName="firstName" 
                class="form-control" 
                placeholder="Jean" 
              />
              @if (firstNameControl.touched && firstNameControl.errors) {
                <div class="form-error">
                  @if (firstNameControl.errors['required']) {
                    Le prénom est requis
                  }
                </div>
              }
            </div>
            
            <div class="form-group">
              <label for="lastName" class="form-label">Nom</label>
              <input 
                type="text" 
                id="lastName" 
                formControlName="lastName" 
                class="form-control" 
                placeholder="Dupont" 
              />
              @if (lastNameControl.touched && lastNameControl.errors) {
                <div class="form-error">
                  @if (lastNameControl.errors['required']) {
                    Le nom est requis
                  }
                </div>
              }
            </div>
          </div>
          
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
              placeholder="Créez un mot de passe" 
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
          
          <div class="form-group">
            <label class="form-label">Je suis un(e)</label>
            <div class="role-selection">
              <label class="role-option" [class.selected]="roleControl.value === 'student'">
                <input type="radio" formControlName="role" value="student" />
                <div class="role-content">
                  <span class="role-icon">👨‍🎓</span>
                  <span class="role-label">Étudiant</span>
                </div>
              </label>
              
              <label class="role-option" [class.selected]="roleControl.value === 'teacher'">
                <input type="radio" formControlName="role" value="teacher" />
                <div class="role-content">
                  <span class="role-icon">👨‍🏫</span>
                  <span class="role-label">Enseignant</span>
                </div>
              </label>
            </div>
            @if (roleControl.touched && roleControl.errors) {
              <div class="form-error">
                @if (roleControl.errors['required']) {
                  Veuillez sélectionner un rôle
                }
              </div>
            }
          </div>
          
          <div class="form-actions">
            <button 
              type="submit" 
              class="btn btn-primary btn-block" 
              [disabled]="registerForm.invalid || isLoading"
            >
              @if (isLoading) {
                Création du compte...
              } @else {
                S'inscrire
              }
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Vous avez déjà un compte ? <a routerLink="/auth/login" class="text-primary">Connectez-vous ici</a></p>
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
      max-width: 500px;
    }
    
    .auth-title {
      text-align: center;
      margin-bottom: var(--space-4);
    }
    
    .auth-form {
      margin-bottom: var(--space-4);
    }
    
    .form-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: var(--space-3);
    }
    
    @media (min-width: 576px) {
      .form-row {
        grid-template-columns: 1fr 1fr;
      }
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
    
    .role-selection {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--space-3);
      margin-top: var(--space-2);
    }
    
    .role-option {
      position: relative;
      border: 2px solid var(--neutral-300);
      border-radius: var(--radius-md);
      padding: var(--space-3);
      text-align: center;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .role-option input {
      position: absolute;
      opacity: 0;
    }
    
    .role-option.selected {
      border-color: var(--primary-500);
      background-color: var(--primary-50);
    }
    
    .role-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .role-icon {
      font-size: 2rem;
      margin-bottom: var(--space-2);
    }
    
    .role-label {
      font-weight: 600;
    }
  `]
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['student', Validators.required]
    });
  }

  get firstNameControl() {
    return this.registerForm.get('firstName')!;
  }

  get lastNameControl() {
    return this.registerForm.get('lastName')!;
  }

  get emailControl() {
    return this.registerForm.get('email')!;
  }

  get passwordControl() {
    return this.registerForm.get('password')!;
  }

  get roleControl() {
    return this.registerForm.get('role')!;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        this.toastService.show({
          message: 'Compte créé avec succès !',
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
          message: error.message || 'Échec de l\'inscription. Veuillez réessayer.',
          type: 'error'
        });
      }
    });
  }
}
