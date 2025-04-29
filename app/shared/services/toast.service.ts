import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id?: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toasts.asObservable();

  constructor() { }

  show(toast: Toast): void {
    const id = this.generateId();
    const duration = toast.duration || 5000;
    
    const newToast = {
      ...toast,
      id
    };
    
    this.toasts.next([...this.toasts.value, newToast]);
    
    // Auto dismiss after duration
    setTimeout(() => {
      this.dismiss(id);
    }, duration);
  }

  dismiss(id: string): void {
    const currentToasts = this.toasts.value;
    const updatedToasts = currentToasts.filter(toast => toast.id !== id);
    this.toasts.next(updatedToasts);
  }

  private generateId(): string {
    return Date.now().toString();
  }
}
