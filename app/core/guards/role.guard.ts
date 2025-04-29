import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../../shared/services/toast.service';

export const RoleGuard = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const toastService = inject(ToastService);
  
  const expectedRole = route.data['role'];
  
  if (authService.hasRole(expectedRole)) {
    return true;
  }

  toastService.show({
    message: `Access denied. You need ${expectedRole} permissions.`,
    type: 'error'
  });
  
  router.navigate(['/']);
  return false;
};
