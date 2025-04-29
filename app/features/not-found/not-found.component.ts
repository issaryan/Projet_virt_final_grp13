import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <h1 class="not-found-title">404</h1>
        <h2 class="not-found-subtitle">Page Not Found</h2>
        <p class="not-found-message">The page you're looking for doesn't exist or has been moved.</p>
        <a routerLink="/" class="btn btn-primary mt-4">Go Home</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: calc(100vh - 200px);
      text-align: center;
    }
    
    .not-found-content {
      max-width: 500px;
      padding: var(--space-4);
    }
    
    .not-found-title {
      font-size: 6rem;
      font-weight: 700;
      color: var(--primary-500);
      margin-bottom: var(--space-2);
      line-height: 1;
    }
    
    .not-found-subtitle {
      font-size: 2rem;
      margin-bottom: var(--space-3);
      color: var(--neutral-700);
    }
    
    .not-found-message {
      font-size: 1.1rem;
      color: var(--neutral-600);
      margin-bottom: var(--space-4);
    }
  `]
})
export class NotFoundComponent {}
