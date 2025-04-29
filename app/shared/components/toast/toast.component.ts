import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Toast, ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toasts; track toast.id) {
        <div class="toast toast-{{ toast.type }} scale-in" (click)="dismiss(toast.id!)">
          <div class="toast-content">
            <div class="toast-icon">
              @switch (toast.type) {
                @case ('success') {
                  <span>✓</span>
                }
                @case ('error') {
                  <span>✕</span>
                }
                @case ('warning') {
                  <span>!</span>
                }
                @case ('info') {
                  <span>i</span>
                }
              }
            </div>
            <div class="toast-message">{{ toast.message }}</div>
          </div>
          <button class="toast-close" (click)="dismiss(toast.id!)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      bottom: var(--space-4);
      right: var(--space-4);
      display: flex;
      flex-direction: column;
      gap: var(--space-2);
      z-index: 1000;
      max-width: 350px;
    }
    
    .toast {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-md);
      min-width: 300px;
    }
    
    .toast-content {
      display: flex;
      align-items: center;
      gap: var(--space-2);
    }
    
    .toast-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      font-weight: bold;
    }
    
    .toast-success {
      background-color: var(--success-50);
      border-left: 4px solid var(--success-500);
      color: var(--success-900);
    }
    
    .toast-success .toast-icon {
      background-color: var(--success-500);
      color: white;
    }
    
    .toast-error {
      background-color: var(--error-50);
      border-left: 4px solid var(--error-500);
      color: var(--error-900);
    }
    
    .toast-error .toast-icon {
      background-color: var(--error-500);
      color: white;
    }
    
    .toast-warning {
      background-color: var(--warning-50);
      border-left: 4px solid var(--warning-500);
      color: var(--warning-900);
    }
    
    .toast-warning .toast-icon {
      background-color: var(--warning-500);
      color: white;
    }
    
    .toast-info {
      background-color: var(--primary-50);
      border-left: 4px solid var(--primary-500);
      color: var(--primary-900);
    }
    
    .toast-info .toast-icon {
      background-color: var(--primary-500);
      color: white;
    }
    
    .toast-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0.7;
    }
    
    .toast-close:hover {
      opacity: 1;
    }
  `]
})
export class ToastComponent implements OnInit, OnDestroy {
  toasts: Toast[] = [];
  private subscription: Subscription | null = null;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    this.subscription = this.toastService.toasts$.subscribe(toasts => {
      this.toasts = toasts;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }
}
