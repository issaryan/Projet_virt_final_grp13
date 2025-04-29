import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="navbar">
      <div class="container">
        <a routerLink="/" class="navbar-brand">QuizMaster</a>
        
        <nav class="hide-mobile">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-link">Home</a>
            </li>
            
            @if (currentUser) {
              @if (currentUser.role === 'teacher') {
                <li class="nav-item">
                  <a routerLink="/teacher/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
                </li>
                <li class="nav-item">
                  <a routerLink="/teacher/quizzes" routerLinkActive="active" class="nav-link">My Quizzes</a>
                </li>
              } @else if (currentUser.role === 'student') {
                <li class="nav-item">
                  <a routerLink="/student/dashboard" routerLinkActive="active" class="nav-link">Dashboard</a>
                </li>
                <li class="nav-item">
                  <a routerLink="/student/join" routerLinkActive="active" class="nav-link">Join Quiz</a>
                </li>
              }
            }
          </ul>
        </nav>
        
        <div class="user-menu">
          @if (currentUser) {
            <div class="user-info">
              <div class="avatar">{{ getUserInitials(currentUser) }}</div>
              <div class="user-dropdown">
                <div class="user-name">{{ currentUser.firstName }} {{ currentUser.lastName }}</div>
                <div class="user-role">{{ currentUser.role }}</div>
                <div class="dropdown-divider"></div>
                <button class="dropdown-item" (click)="logout()">Logout</button>
              </div>
            </div>
          } @else {
            <div class="auth-buttons">
              <a routerLink="/auth/login" class="btn btn-outline mr-2">Login</a>
              <a routerLink="/auth/register" class="btn btn-primary">Register</a>
            </div>
          }
        </div>
      </div>
    </header>
  `,
  styles: [`
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background-color: white;
      box-shadow: var(--shadow-md);
    }
    
    .navbar .container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-2) var(--space-3);
    }
    
    .user-menu {
      position: relative;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      position: relative;
    }
    
    .user-info:hover .user-dropdown {
      display: block;
    }
    
    .user-dropdown {
      display: none;
      position: absolute;
      top: calc(100% + 10px);
      right: 0;
      background-color: white;
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      min-width: 200px;
      padding: var(--space-2);
      z-index: 10;
    }
    
    .user-name {
      font-weight: 600;
      margin-bottom: var(--space-1);
    }
    
    .user-role {
      color: var(--neutral-500);
      font-size: 0.875rem;
      text-transform: capitalize;
      margin-bottom: var(--space-2);
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: var(--neutral-200);
      margin: var(--space-2) 0;
    }
    
    .dropdown-item {
      display: block;
      width: 100%;
      padding: var(--space-2);
      text-align: left;
      background: none;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
    }
    
    .dropdown-item:hover {
      background-color: var(--neutral-100);
    }
    
    @media (max-width: 768px) {
      .auth-buttons .btn {
        padding: var(--space-1) var(--space-2);
        font-size: 0.875rem;
      }
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  getUserInitials(user: User): string {
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  }
}
