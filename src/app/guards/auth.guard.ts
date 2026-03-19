import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const user = authService.getCurrentUser();
    
    // Role-based check for admin routes
    if (state.url.includes('/admin') && user?.role !== 'admin') {
      console.warn('Access denied: Admin role required');
      router.navigate(['/thecrumbco']);
      return false;
    }
    
    return true;
  } else {
    // Redirect to signup/login page
    router.navigate(['/thecrumbco/signup']);
    return false;
  }
};
