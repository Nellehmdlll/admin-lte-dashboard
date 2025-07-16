import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

export function roleGuard(requiredRoles: string[]): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const userRole = auth.getUserRole();

    console.log('👮‍♂️ roleGuard - rôle actuel:', userRole);
    console.log('👮‍♂️ roleGuard - rôles requis:', requiredRoles);

    if (!userRole || !requiredRoles.includes(userRole)) {
      console.warn('🔐 Accès refusé, redirection vers /unauthorized');
      router.navigate(['/unauthorized']);
      return false;
    }

    console.log('✅ Accès autorisé');
    return true;
  };
}

