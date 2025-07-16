import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const isLoggedIn = auth.isAuthenticated();
  console.log('authGuard -> isAuthenticated:', isLoggedIn);

  if (!isLoggedIn) {
    console.warn('Non authentifié → redirection vers /login');
    router.navigate(['/login']);
    return false;
  }

  return true;
};

